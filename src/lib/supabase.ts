
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Initializing Supabase client with URL:', supabaseUrl);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables!');
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Test connection on initialization
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error('Supabase auth error:', error);
  } else {
    console.log('Supabase connection initialized successfully');
  }
}).catch(err => {
  console.error('Failed to initialize Supabase connection:', err);
});
