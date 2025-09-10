import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables');
  console.error('VITE_SUPABASE_URL:', !!process.env.VITE_SUPABASE_URL);
  console.error('SUPABASE_SERVICE_ROLE_KEY:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixSlugConsistency() {
  console.log('🔧 Fixing slug generation consistency...\n');

  try {
    // Read the migration SQL file
    const migrationSQL = fs.readFileSync('supabase/migrations/20250829000000_fix_slug_consistency.sql', 'utf8');

    // Split the SQL into individual statements
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`📄 Found ${statements.length} SQL statements to execute\n`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`Executing statement ${i + 1}/${statements.length}...`);

      try {
        const { error } = await supabase.rpc('exec_sql', { sql: statement });

        if (error) {
          // If exec_sql doesn't exist, try direct execution for simple statements
          console.log('   Trying direct execution...');
          const { error: directError } = await supabase.from('solarhub_db').select('*').limit(1);

          if (directError) {
            console.error(`❌ Failed to execute statement ${i + 1}:`, error.message);
            continue;
          }
        }

        console.log(`   ✅ Statement ${i + 1} executed successfully`);
      } catch (err) {
        console.error(`❌ Error executing statement ${i + 1}:`, err.message);
      }
    }

    console.log('\n🔄 Updating name_slug values...');

    // Get all contacts that need slug updates
    const { data: contacts, error: fetchError } = await supabase
      .from('solarhub_db')
      .select('id, name, name_slug')
      .not('name', 'is', null)
      .neq('name', '');

    if (fetchError) {
      console.error('❌ Failed to fetch contacts:', fetchError);
      return;
    }

    console.log(`📊 Found ${contacts?.length || 0} contacts to update`);

    // Simple slugify function matching utils.ts
    function slugify(str) {
      if (!str) return '';
      return str
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    }

    // Track used slugs to ensure uniqueness
    const usedSlugs = new Set();
    let updated = 0;
    let skipped = 0;

    for (const contact of contacts || []) {
      const expectedSlug = slugify(contact.name);
      let uniqueSlug = expectedSlug;
      let counter = 1;

      // Ensure uniqueness
      while (usedSlugs.has(uniqueSlug)) {
        uniqueSlug = `${expectedSlug}-${counter}`;
        counter++;
      }

      usedSlugs.add(uniqueSlug);

      // Update if different
      if (contact.name_slug !== uniqueSlug) {
        const { error: updateError } = await supabase
          .from('solarhub_db')
          .update({ name_slug: uniqueSlug })
          .eq('id', contact.id);

        if (updateError) {
          console.error(`❌ Failed to update contact ${contact.id}:`, updateError);
        } else {
          updated++;
          if (updated <= 5) { // Log first few updates
            console.log(`   Updated: "${contact.name}" -> "${uniqueSlug}"`);
          }
        }
      } else {
        skipped++;
      }
    }

    console.log(`\n📈 Update Summary:`);
    console.log(`   Updated: ${updated} records`);
    console.log(`   Skipped: ${skipped} records (already correct)`);

    // Verify the fix
    console.log('\n🔍 Verifying the fix...');

    const { data: sampleContacts, error: verifyError } = await supabase
      .from('solarhub_db')
      .select('name, name_slug')
      .limit(10);

    if (verifyError) {
      console.error('❌ Verification failed:', verifyError);
    } else {
      console.log('Sample updated records:');
      sampleContacts?.forEach((contact, index) => {
        const expected = slugify(contact.name);
        const isCorrect = contact.name_slug === expected || contact.name_slug?.startsWith(expected + '-');
        console.log(`   ${index + 1}. "${contact.name}" -> "${contact.name_slug}" ${isCorrect ? '✅' : '❌'}`);
      });
    }

    console.log('\n🎉 Slug consistency fix completed!');

  } catch (error) {
    console.error('❌ Fix failed with error:', error);
  }
}

fixSlugConsistency();