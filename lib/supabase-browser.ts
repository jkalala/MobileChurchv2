import { createClient as createSupabaseClient, type SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "./database-types"

/* -----------------------------------------------------------------------
   Hard-coded keys work as a last-ditch fallback, while env vars take priority
----------------------------------------------------------------------- */
const FALLBACK_URL = "https://gdrbytizqbpyticofapo.supabase.co" // <- your project URL
const FALLBACK_ANON =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkcmJ5dGl6cWJweXRpY29mYXBvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1MDM1MjUsImV4cCI6MjA2NjA3OTUyNX0.dD4WMZyJ-e7sQosiKyJboTHsjI57DHlgleD2bkEQiOk"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? FALLBACK_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? FALLBACK_ANON

if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.error(
    "❌  Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY " +
      "environment variables – Supabase client will not work.",
  )
}

let browserClient: SupabaseClient<Database> | null = null

function createBrowserClient() {
  return createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  })
}

/** Singleton getter (recommended) */
export function getSupabaseBrowserClient(): SupabaseClient<Database> {
  if (!browserClient) browserClient = createBrowserClient()
  return browserClient
}

// Default export so existing `import supabase from` continues to work
export default getSupabaseBrowserClient()
