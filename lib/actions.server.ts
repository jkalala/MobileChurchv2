"use server"

/**
 * Server-side helpers that talk directly to Supabase.
 * These are ONLY imported by other server files or Server Actions.
 */
import { createServerClient } from "@/lib/supabase-client"
import { revalidatePath } from "next/cache"

export async function bulkUpdateMembers(memberIds: string[], updates: Record<string, any>) {
  const supabase = createServerClient()

  const { error } = await supabase.from("members").update(updates).in("id", memberIds)

  if (error) throw error

  revalidatePath("/dashboard")
  return { success: true }
}

export async function bulkDeleteMembers(memberIds: string[]) {
  const supabase = createServerClient()

  const { error } = await supabase.from("members").delete().in("id", memberIds)
  if (error) throw error

  revalidatePath("/dashboard")
  return { success: true }
}

export async function sendBulkReminders(memberIds: string[], message: string) {
  // TODO: Replace with real email / SMS provider
  console.log(`Sending reminder to ${memberIds.length} members: ${message}`)
  return { success: true }
}
