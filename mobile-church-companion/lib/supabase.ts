import { createClient } from '@supabase/supabase-js';

// Hardcoded values to bypass .env issues
const SUPABASE_URL = 'https://gdrbytizqbpyticofapo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkcmJ5dGl6cWJweXRpY29mYXBvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1MDM1MjUsImV4cCI6MjA2NjA3OTUyNX0.dD4WMZyJ-e7sQosiKyJboTHsjI57DHlgleD2bkEQiOk';

console.log('Supabase URL:', SUPABASE_URL);
console.log('Supabase Key length:', SUPABASE_ANON_KEY.length);

if (!SUPABASE_URL) {
  throw new Error('SUPABASE_URL is required');
}

if (!SUPABASE_ANON_KEY) {
  throw new Error('SUPABASE_ANON_KEY is required');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY); 