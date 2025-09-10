import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase environment variables not found');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSolution() {
  console.log('🧪 Testing the UUID and name_slug solution...\n');

  try {
    // 1. Test database connection and fetch sample data
    console.log('1. Testing database connection and fetching sample data...');
    const { data: contacts, error } = await supabase
      .from('solarhub_db')
      .select('*')
      .limit(5);

    if (error) {
      console.error('❌ Database connection failed:', error);
      return;
    }

    console.log(`✅ Successfully connected to database. Found ${contacts?.length || 0} sample records.`);

    if (!contacts || contacts.length === 0) {
      console.log('⚠️  No data found in solarhub_db table');
      return;
    }

    // 2. Check if uuid and name_slug columns exist
    console.log('\n2. Checking for uuid and name_slug columns...');
    const firstContact = contacts[0];

    const hasUuid = 'uuid' in firstContact;
    const hasNameSlug = 'name_slug' in firstContact;

    console.log(`UUID column present: ${hasUuid ? '✅' : '❌'}`);
    console.log(`name_slug column present: ${hasNameSlug ? '✅' : '❌'}`);

    if (!hasUuid || !hasNameSlug) {
      console.log('\n❌ Migration appears to have failed - missing required columns');
      return;
    }

    // 3. Analyze data quality
    console.log('\n3. Analyzing data quality...');
    let uuidCount = 0;
    let nameSlugCount = 0;
    let totalRecords = contacts.length;

    contacts.forEach((contact, index) => {
      if (contact.uuid) uuidCount++;
      if (contact.name_slug) nameSlugCount++;

      // Log first few records for inspection
      if (index < 3) {
        console.log(`\nRecord ${index + 1}:`);
        console.log(`  Name: ${contact.name}`);
        console.log(`  UUID: ${contact.uuid || 'null'}`);
        console.log(`  Name Slug: ${contact.name_slug || 'null'}`);
      }
    });

    console.log(`\n📊 Data Quality Summary:`);
    console.log(`  Records with UUID: ${uuidCount}/${totalRecords} (${Math.round((uuidCount/totalRecords)*100)}%)`);
    console.log(`  Records with name_slug: ${nameSlugCount}/${totalRecords} (${Math.round((nameSlugCount/totalRecords)*100)}%)`);

    // 4. Test slug generation logic
    console.log('\n4. Testing slug generation logic...');

    // Simple slugify function for testing
    function testSlugify(str) {
      if (!str) return '';
      return str
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    }

    contacts.forEach((contact, index) => {
      if (index < 3 && contact.name) {
        const expectedSlug = testSlugify(contact.name);
        const actualSlug = contact.name_slug;
        const match = expectedSlug === actualSlug;

        console.log(`  "${contact.name}" -> "${actualSlug}" ${match ? '✅' : `❌ (expected: "${expectedSlug}")`}`);
      }
    });

    // 5. Test routing capability
    console.log('\n5. Testing routing capability...');
    if (contacts.some(c => c.name_slug)) {
      console.log('✅ Some records have name_slug values - routing should work');

      // Test a sample query by name_slug
      const testSlug = contacts.find(c => c.name_slug)?.name_slug;
      if (testSlug) {
        const { data: foundContact, error: findError } = await supabase
          .from('solarhub_db')
          .select('*')
          .eq('name_slug', testSlug)
          .single();

        if (findError) {
          console.log(`❌ Error querying by name_slug: ${findError.message}`);
        } else {
          console.log(`✅ Successfully found contact by name_slug: "${testSlug}"`);
        }
      }
    } else {
      console.log('❌ No records have name_slug values - routing will not work');
    }

    // 6. Overall assessment
    console.log('\n🎯 Overall Assessment:');

    const migrationSuccess = hasUuid && hasNameSlug;
    const dataQualityGood = (uuidCount/totalRecords) > 0.8 && (nameSlugCount/totalRecords) > 0.8;

    if (migrationSuccess && dataQualityGood) {
      console.log('✅ SOLUTION SUCCESSFUL: Migration completed and data populated correctly');
    } else if (migrationSuccess && !dataQualityGood) {
      console.log('⚠️  PARTIAL SUCCESS: Migration completed but data population incomplete');
      console.log('   Recommendation: Run the UUID/slug generation script');
    } else {
      console.log('❌ SOLUTION FAILED: Migration did not complete successfully');
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

testSolution();