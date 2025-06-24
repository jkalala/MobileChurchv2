export const dynamic = "force-dynamic"

import { redirect } from "next/navigation"

export default function AppPage() {
  // Redirect to dashboard since this is likely meant to be the main app entry
  redirect("/dashboard")
}
