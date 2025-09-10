// This script updates the solarhub_db table in Supabase
// It ensures all entries have a valid UUID in the 'id' column
// and a SEO-friendly 'name_slug' column.

import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();

// Supabase configuration - ensure you have your URL and anon key in .env
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use a service role key for full permissions

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase URL or Service Role Key in environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Helper function to generate a UUID
function generateUUID() {
  return crypto.randomUUID();
}

// Helper function to slugify a string (similar to the one in utils.ts)
function slugify(str) {
  if (!str) return '';
  // Remove diacritics
  const strWithoutDiacritics = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  // Convert to lowercase, replace non-alphanumeric with hyphens, remove leading/trailing hyphens
  return strWithoutDiacritics
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

async function updateSolarHubData() {
  console.log('Starting data update for solarhub_db...');

  try {
    // 1. Fetch all records from solarhub_db
    const { data: companies, error: fetchError } = await supabase
      .from('solarhub_db')
      .select('*');

    if (fetchError) {
      console.error('Error fetching companies:', fetchError);
      return;
    }

    if (!companies || companies.length === 0) {
      console.log('No companies found in solarhub_db.');
      return;
    }

    console.log(`Found ${companies.length} companies to process.`);

    let updateCount = 0;
    let noChangeCount = 0;

    // 2. Iterate through each company and prepare updates
    for (const company of companies) {
      let needsUpdate = false;
      const updateData = {};

      // Check and update UUID
      if (!company.uuid || !isValidUUID(company.uuid)) {
        updateData.uuid = generateUUID();
        needsUpdate = true;
        console.log(`Generated new UUID for company: ${company.name || 'Unknown Name'}`);
      }

      // Check and update name_slug
      const currentNameSlug = company.name_slug;
      const generatedNameSlug = company.name ? slugify(company.name) : '';

      if (!currentNameSlug || currentNameSlug !== generatedNameSlug) {
        updateData.name_slug = generatedNameSlug;
        needsUpdate = true;
        console.log(`Generated/updated name_slug for company: ${company.name || 'Unknown Name'} -> ${generatedNameSlug}`);
      }

      // 3. If updates are needed, perform the update
      if (needsUpdate) {
        // We need to identify the record to update.
        // Use the original 'id' (bigint) as the primary key for identification
        let updateQuery;
        if (company.id) {
          // Use the original bigint id as the primary key
          updateQuery = supabase
            .from('solarhub_db')
            .update(updateData)
            .eq('id', company.id);
        } else {
          console.warn(`Cannot update company: No id available.`);
          continue;
        }

        const { error: updateError } = await updateQuery;

        if (updateError) {
          console.error(`Error updating company ${company.name || company.id}:`, updateError);
        } else {
          console.log(`Successfully updated company: ${company.name || 'Unknown Name'}`);
          updateCount++;
        }
      } else {
        noChangeCount++;
      }
    }

    console.log(`\nUpdate Summary:`);
    console.log(`- Companies updated: ${updateCount}`);
    console.log(`- Companies with no changes: ${noChangeCount}`);
    console.log('Data update process finished.');

  } catch (error) {
    console.error('An unexpected error occurred during the update process:', error);
  }
}

// Helper function to check if a string is a valid UUID
function isValidUUID(uuid) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

// Run the update function
updateSolarHubData();
