
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vtjpbsfogcwqvgbllsqe.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0anBic2ZvZ2N3cXZnYmxsc3FlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2Mzk3MjQsImV4cCI6MjA1ODIxNTcyNH0.5bU4C32vLSlHW-mmVcXIg1vMZb_o3_k-u5OIdpUxNLk';

// We're using type assertion here to bypass the type checking issues
// This is safe as we know these tables exist in our database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
