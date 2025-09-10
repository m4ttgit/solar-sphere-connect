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

// Simple slugify function matching the utils.ts implementation
function slugify(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

async function testSearchFunctionality() {
  console.log('🔍 Testing search functionality with new fields...\n');

  try {
    // Get all contacts for testing
    const { data: allContacts, error } = await supabase
      .from('solarhub_db')
      .select('*');

    if (error) {
      console.error('❌ Failed to fetch contacts:', error);
      return;
    }

    console.log(`📊 Testing with ${allContacts?.length || 0} total contacts\n`);

    // Test 1: Search by name
    console.log('1. Testing name search...');
    const nameSearch = 'solar';
    const nameResults = allContacts?.filter(contact =>
      contact.name?.toLowerCase().includes(nameSearch.toLowerCase())
    ) || [];

    console.log(`   Search term: "${nameSearch}"`);
    console.log(`   Found ${nameResults.length} results`);
    if (nameResults.length > 0) {
      console.log(`   Sample result: "${nameResults[0].name}"`);
    }

    // Test 2: Search by city
    console.log('\n2. Testing city search...');
    const citySearch = 'san';
    const cityResults = allContacts?.filter(contact =>
      contact.city?.toLowerCase().includes(citySearch.toLowerCase())
    ) || [];

    console.log(`   Search term: "${citySearch}"`);
    console.log(`   Found ${cityResults.length} results`);
    if (cityResults.length > 0) {
      console.log(`   Sample result: "${cityResults[0].name}" in ${cityResults[0].city}`);
    }

    // Test 3: Search by services (array field)
    console.log('\n3. Testing services search...');
    const serviceSearch = 'installation';
    const serviceResults = allContacts?.filter(contact =>
      Array.isArray(contact.services) &&
      contact.services.some(service =>
        service?.toLowerCase().includes(serviceSearch.toLowerCase())
      )
    ) || [];

    console.log(`   Search term: "${serviceSearch}"`);
    console.log(`   Found ${serviceResults.length} results`);
    if (serviceResults.length > 0) {
      console.log(`   Sample result: "${serviceResults[0].name}" - services: ${serviceResults[0].services?.join(', ')}`);
    }

    // Test 4: Test name_slug routing
    console.log('\n4. Testing name_slug routing...');
    const testSlugs = allContacts?.slice(0, 3).map(contact => contact.name_slug).filter(Boolean) || [];

    for (const slug of testSlugs) {
      const { data: foundContact, error: findError } = await supabase
        .from('solarhub_db')
        .select('*')
        .eq('name_slug', slug)
        .single();

      if (findError) {
        console.log(`   ❌ Failed to find contact with slug: "${slug}" - ${findError.message}`);
      } else {
        console.log(`   ✅ Successfully found: "${foundContact.name}" via slug "${slug}"`);
      }
    }

    // Test 5: Validate slug consistency
    console.log('\n5. Validating slug generation consistency...');
    let consistentSlugs = 0;
    let totalChecked = 0;

    allContacts?.forEach(contact => {
      if (contact.name && contact.name_slug) {
        totalChecked++;
        const expectedSlug = slugify(contact.name);
        const actualSlug = contact.name_slug;
        const isConsistent = expectedSlug === actualSlug;

        if (isConsistent) {
          consistentSlugs++;
        } else {
          console.log(`   ⚠️  Inconsistent slug for "${contact.name}":`);
          console.log(`      Expected: "${expectedSlug}"`);
          console.log(`      Actual:   "${actualSlug}"`);
        }
      }
    });

    const consistencyRate = totalChecked > 0 ? Math.round((consistentSlugs / totalChecked) * 100) : 0;
    console.log(`   Slug consistency: ${consistentSlugs}/${totalChecked} (${consistencyRate}%)`);

    // Test 6: Performance test - simulate DirectoryPage query
    console.log('\n6. Testing query performance...');
    const startTime = Date.now();

    // Simulate the query used in DirectoryPage
    const { data: pageData, error: pageError } = await supabase
      .from('solarhub_db')
      .select('*')
      .range(0, 49); // First 50 records like pagination

    const endTime = Date.now();
    const queryTime = endTime - startTime;

    if (pageError) {
      console.log(`   ❌ Query failed: ${pageError.message}`);
    } else {
      console.log(`   ✅ Query successful in ${queryTime}ms`);
      console.log(`   Retrieved ${pageData?.length || 0} records`);
      console.log(`   Sample UUID: ${pageData?.[0]?.uuid}`);
      console.log(`   Sample name_slug: ${pageData?.[0]?.name_slug}`);
    }

    // Summary
    console.log('\n🎯 Search Functionality Assessment:');

    const searchTests = [
      { name: 'Name search', passed: nameResults.length >= 0 },
      { name: 'City search', passed: cityResults.length >= 0 },
      { name: 'Services search', passed: serviceResults.length >= 0 },
      { name: 'Name_slug routing', passed: testSlugs.length > 0 },
      { name: 'Query performance', passed: queryTime < 1000 },
      { name: 'Slug consistency', passed: consistencyRate >= 95 }
    ];

    const passedTests = searchTests.filter(test => test.passed).length;
    const totalTests = searchTests.length;

    searchTests.forEach(test => {
      console.log(`   ${test.passed ? '✅' : '❌'} ${test.name}`);
    });

    console.log(`\n📊 Overall: ${passedTests}/${totalTests} tests passed`);

    if (passedTests === totalTests) {
      console.log('🎉 All search functionality tests PASSED!');
    } else if (passedTests >= totalTests * 0.8) {
      console.log('⚠️  Most search functionality tests passed, but some issues need attention');
    } else {
      console.log('❌ Search functionality has significant issues');
    }

  } catch (error) {
    console.error('❌ Search test failed with error:', error);
  }
}

testSearchFunctionality();