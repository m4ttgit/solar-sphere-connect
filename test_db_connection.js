// Simple test to check database connection
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function testConnection() {
  try {
    console.log('Testing database connection...');

    const { data, error } = await supabase
      .from('solarhub_db')
      .select('name, name_slug')
      .limit(3);

    if (error) {
      console.error('Database error:', error);
      return;
    }

    console.log('Connection successful!');
    console.log('Sample data:');
    data.forEach((company, index) => {
      console.log(`${index + 1}. ${company.name} -> ${company.name_slug}`);
    });

  } catch (error) {
    console.error('Connection failed:', error.message);
  }
}

testConnection();