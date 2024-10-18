// lib/supabaseClient.ts
//@ts-ignore
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRic2lkemJjZGFqeXdqdnJyeW53Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNjM3MjMwOSwiZXhwIjoyMDQxOTQ4MzA5fQ.rFkV5E8KRi6yf-W32xswKtlDJb-nrfywXfEFyssdUfk';

if (!supabaseUrl || !supabaseKey) {
  console.log('Missing Supabase URL or Key in environment variables');
  throw new Error('Missing Supabase URL or Key in environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
