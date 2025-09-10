import { v4 as uuidv4 } from 'uuid';
import { slugify } from '../src/lib/utils';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.example' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL and Anon Key must be set as environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function generateUuidsAndSlugs() {
  try {
    // 1. Fetch all data from solarhub_db
    const { data: contacts, error } = await supabase
      .from('solarhub_db')
      .select('*');

    if (error) {
      console.error('Error fetching contacts:', error);
      process.exit(1);
    }

    if (!contacts || contacts.length === 0) {
      console.warn('No contacts found in solarhub_db.');
      process.exit(0);
    }

    // 2. Iterate through each contact and update with uuid and name_slug if missing
    for (const contact of contacts) {
      let updateData: { uuid?: string; name_slug?: string } = {};

      if (!contact.uuid) {
        updateData.uuid = uuidv4();
      }

      if (!contact.name_slug) {
        updateData.name_slug = slugify(contact.name || '');
      }

      // 3. Update the record if either uuid or name_slug is missing
      if (Object.keys(updateData).length > 0) {
        const { error: updateError } = await supabase
          .from('solarhub_db')
          .update(updateData)
          .eq('id', contact.id);

        if (updateError) {
          console.error(`Error updating contact with id ${contact.id}:`, updateError);
        } else {
          console.log(`Updated contact with id ${contact.id}`);
        }
      } else {
        console.log(`Contact with id ${contact.id} already has uuid and name_slug`);
      }
    }

    console.log('Finished processing all contacts.');

  } catch (e) {
    console.error('An error occurred:', e);
  }
}

generateUuidsAndSlugs();
