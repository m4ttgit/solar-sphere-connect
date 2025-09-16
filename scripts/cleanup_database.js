import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

// Supabase configuration
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

function isValidCompanyName(name) {
  if (!name || typeof name !== 'string') return false;
  
  // Invalid patterns
  const invalidPatterns = [
    /^\d{5,}$/, // Just numbers (zip codes, phone numbers)
    /^[A-Z]{2}$/, // Just state codes
    /@/, // Email addresses
    /^https?:\/\//, // URLs
    /^\d+\s+\w+\s+(Street|Ave|Road|Blvd|Dr|Ln|Way|Ct)/, // Addresses
    /^Suite\s+\w+/, // Suite numbers
    /^PO\s+Box/, // PO Boxes
    /^not\s+available$/i, // "not available"
    /^\s*$/, // Empty or whitespace
  ];
  
  return !invalidPatterns.some(pattern => pattern.test(name.trim()));
}

function isValidWebsite(website) {
  if (!website) return true; // Allow empty websites
  
  // Should look like a domain or URL
  const websitePattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/.*)?$/;
  return websitePattern.test(website) || website.includes('.com') || website.includes('.net') || website.includes('.org');
}

async function cleanupDatabase() {
  try {
    console.log('Fetching all records from solarhub_db...');
    
    const { data: records, error } = await supabase
      .from('solarhub_db')
      .select('*');
    
    if (error) throw error;
    
    console.log(`Found ${records.length} records`);
    
    const validRecords = [];
    const invalidRecords = [];
    const updatedRecords = [];
    
    records.forEach(record => {
      // Check if company name is valid
      if (!isValidCompanyName(record.name)) {
        invalidRecords.push({
          id: record.id,
          name: record.name,
          reason: 'Invalid company name'
        });
        return;
      }
      
      // Generate proper slug from company name
      const properSlug = slugify(record.name);
      
      // Check if slug needs updating
      if (record.name_slug !== properSlug) {
        updatedRecords.push({
          id: record.id,
          old_slug: record.name_slug,
          new_slug: properSlug,
          name: record.name
        });
        
        record.name_slug = properSlug;
      }
      
      validRecords.push(record);
    });
    
    console.log(`\nCleanup Summary:`);
    console.log(`- Valid records: ${validRecords.length}`);
    console.log(`- Invalid records to delete: ${invalidRecords.length}`);
    console.log(`- Records needing slug updates: ${updatedRecords.length}`);
    
    // Save reports
    fs.writeFileSync('d:/Projects/solar-sphere-connect/cleanup_report.json', JSON.stringify({
      valid: validRecords.length,
      invalid: invalidRecords,
      updated: updatedRecords
    }, null, 2));
    
    console.log('\nCleanup report saved to cleanup_report.json');
    
    // Ask for confirmation before making changes
    console.log('\nWould you like to proceed with cleanup? (This will delete invalid records and update slugs)');
    console.log('Run with --execute flag to perform actual cleanup');
    
    if (process.argv.includes('--execute')) {
      await performCleanup(invalidRecords, updatedRecords);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function performCleanup(invalidRecords, updatedRecords) {
  console.log('\nPerforming cleanup...');
  
  // Delete invalid records
  if (invalidRecords.length > 0) {
    console.log(`Deleting ${invalidRecords.length} invalid records...`);
    
    const invalidIds = invalidRecords.map(r => r.id);
    const { error: deleteError } = await supabase
      .from('solarhub_db')
      .delete()
      .in('id', invalidIds);
    
    if (deleteError) {
      console.error('Error deleting records:', deleteError);
    } else {
      console.log('✓ Invalid records deleted');
    }
  }
  
  // Update slugs in batches
  if (updatedRecords.length > 0) {
    console.log(`Updating ${updatedRecords.length} slugs...`);
    
    for (const record of updatedRecords) {
      const { error: updateError } = await supabase
        .from('solarhub_db')
        .update({ name_slug: record.new_slug })
        .eq('id', record.id);
      
      if (updateError) {
        console.error(`Error updating ${record.name}:`, updateError);
      }
    }
    
    console.log('✓ Slugs updated');
  }
  
  console.log('\nCleanup completed!');
}

// Run cleanup
cleanupDatabase();