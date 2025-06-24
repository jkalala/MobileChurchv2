import { createClient } from "@supabase/supabase-js"
import type { Database } from "./database-types"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://gdrbytizqbpyticofapo.supabase.co"
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkcmJ5dGl6cWJweXRpY29mYXBvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDUwMzUyNSwiZXhwIjoyMDY2MDc5NTI1fQ.M9rDWUHi2XTTM8fkLk5kfYO0Gd4994bWu_w7GP05pLo"

export function createAdminClient() {
  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
