"use client"

/**
 * Client-side helpers used by dashboards & UI widgets.
 * They **never** import server-only code, so the client bundle stays lean.
 * If you need server work done, call your API routes or Server Actions.
 */

export async function onAction(action: string, memberIds: string[]) {
  console.log(`Executing action: ${action} on members:`, memberIds)

  switch (action) {
    case "activate":
      return bulkUpdateMemberStatus(memberIds, "active")

    case "deactivate":
      return bulkUpdateMemberStatus(memberIds, "inactive")

    case "export":
      return exportMembersToCSV(memberIds)

    case "delete":
      return bulkDeleteMembersClient(memberIds)

    default:
      console.warn("Unknown action:", action)
      return { success: false, error: "Unknown action" }
  }
}

/**
 * ---  Client helpers  -------------------------------------------------------
 * The implementations below call HTTP endpoints so they can run safely
 * from the browser.  You can replace the fetch URLs with real API routes.
 */

export async function bulkUpdateMemberStatus(memberIds: string[], status: string) {
  const res = await fetch("/api/members/bulk-update", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ memberIds, status }),
  })
  return res.ok ? { success: true } : { success: false }
}

export async function bulkDeleteMembersClient(memberIds: string[]) {
  const res = await fetch("/api/members/bulk-delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ memberIds }),
  })
  return res.ok ? { success: true } : { success: false }
}

export async function exportMembersToCSV(memberIds: string[]) {
  // In a real app you'd stream a CSV download.
  console.log(`Pretending to export ${memberIds.length} members to CSV`)
  return { success: true }
}

export async function bulkAssignDepartment(memberIds: string[], department: string) {
  const res = await fetch("/api/members/bulk-update", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ memberIds, department }),
  })
  return res.ok ? { success: true } : { success: false }
}
