import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vtjpbsfogcwqvgbllsqe.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0anBic2ZvZ2N3cXZnYmxsc3FlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2Mzk3MjQsImV4cCI6MjA1ODIxNTcyNH0.5bU4C32vLSlHW-mmVcXIg1vMZb_o3_k-u5OIdpUxNLk';
const supabase = createClient(supabaseUrl, supabaseKey);

function slugify(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function isValidSlug(slug, name) {
  if (!slug || !name) return false;
  
  // Generate expected slug from name
  const expectedSlug = slugify(name);
  
  // Check if current slug is reasonable
  const invalidPatterns = [
    /^\d{5,}$/, // Phone numbers, zip codes
    /@/, // Email addresses
    /^https?:\/\//, // URLs
    /\s/, // Contains spaces
    /^[A-Z]{2}$/, // Just state codes
    /^\d+\s+\w+/, // Addresses starting with numbers
  ];
  
  return !invalidPatterns.some(pattern => pattern.test(slug));
}

async function comprehensiveCleanup() {
  try {
    console.log('Fetching all records from database...');
    
    const { data: records, error } = await supabase
      .from('solarhub_db')
      .select('id, name, name_slug, website, city, state');
    
    if (error) throw error;
    
    console.log(`Found ${records.length} records`);
    
    const toUpdate = [];
    const toDelete = [];
    
    records.forEach(record => {
      // Check if name is valid
      if (!record.name || record.name.trim().length < 2) {
        toDelete.push({
          id: record.id,
          name: record.name,
          reason: 'Invalid or missing name'
        });
        return;
      }
      
      // Check if slug needs fixing
      if (!isValidSlug(record.name_slug, record.name)) {
        const newSlug = slugify(record.name);
        toUpdate.push({
          id: record.id,
          name: record.name,
          old_slug: record.name_slug,
          new_slug: newSlug
        });
      }
    });
    
    console.log(`\nComprehensive Cleanup Summary:`);
    console.log(`- Total records: ${records.length}`);
    console.log(`- Records to delete: ${toDelete.length}`);
    console.log(`- Records needing slug updates: ${toUpdate.length}`);
    
    // Save detailed report
    fs.writeFileSync('d:/Projects/solar-sphere-connect/comprehensive_cleanup_report.json', JSON.stringify({
      total: records.length,
      toDelete,
      toUpdate
    }, null, 2));
    
    console.log('\nDetailed report saved to comprehensive_cleanup_report.json');
    
    if (process.argv.includes('--execute')) {
      await performComprehensiveCleanup(toDelete, toUpdate);
    } else {
      console.log('\nRun with --execute flag to perform actual cleanup');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function performComprehensiveCleanup(toDelete, toUpdate) {
  console.log('\nPerforming comprehensive cleanup...');
  
  // Delete invalid records
  if (toDelete.length > 0) {
    console.log(`Deleting ${toDelete.length} invalid records...`);
    
    const deleteIds = toDelete.map(r => r.id);
    const { error: deleteError } = await supabase
      .from('solarhub_db')
      .delete()
      .in('id', deleteIds);
    
    if (deleteError) {
      console.error('Error deleting records:', deleteError);
    } else {
      console.log('✓ Invalid records deleted');
    }
  }
  
  // Update slugs
  if (toUpdate.length > 0) {
    console.log(`Updating ${toUpdate.length} slugs...`);
    
    let updated = 0;
    for (const record of toUpdate) {
      const { error: updateError } = await supabase
        .from('solarhub_db')
        .update({ name_slug: record.new_slug })
        .eq('id', record.id);
      
      if (updateError) {
        console.error(`Error updating ${record.name}:`, updateError);
      } else {
        updated++;
      }
    }
    
    console.log(`✓ ${updated} slugs updated`);
  }
  
  console.log('\nComprehensive cleanup completed!');
}

comprehensiveCleanup();