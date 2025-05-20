
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://uzsiaphapqaofzeviarm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6c2lhcGhhcHFhb2Z6ZXZpYXJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3NDE5MjEsImV4cCI6MjA2MzMxNzkyMX0.-wLifFM2r41XMptmXOAXREg3Jm01L-Ks-jo1a-VEF6Y";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
