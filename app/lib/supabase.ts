import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Safety Check: If these are missing, the app will tell you why
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase Environment Variables!");
  console.log("URL:", supabaseUrl);
  console.log("Key:", supabaseAnonKey);
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', // Prevents the crash
  supabaseAnonKey || 'placeholder'
);