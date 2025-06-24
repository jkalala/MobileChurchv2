import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth-provider"
import { Dialog } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

const USER_ROLES = [
  { value: "admin", label: "Administrator" },
  { value: "pastor", label: "Pastor" },
  { value: "leader", label: "Leader" },
  { value: "treasurer", label: "Treasurer" },
  { value: "member", label: "Member" },
]

export default function UserManagement() {
  const { userProfile } = useAuth()
  const isAdmin = userProfile?.role === "admin"
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [auditLogs, setAuditLogs] = useState<any[]>([])
  const [inviteOpen, setInviteOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState("member")
  const [inviteLoading, setInviteLoading] = useState(false)
  const [inviteResult, setInviteResult] = useState<string | null>(null)

  useEffect(() => {
    fetchUsers()
    if (isAdmin) fetchAuditLogs()
  }, [isAdmin])

  async function fetchUsers() {
    setLoading(true)
    try {
      const res = await fetch("/api/profile?all=true")
      const data = await res.json()
      setUsers(data.users || [])
    } catch {
      toast({ title: "Failed to load users", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  async function handleRoleChange(userId: string, newRole: string) {
    setSaving(userId)
    try {
      const res = await fetch("/api/profile/role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      })
      if (!res.ok) throw new Error()
      toast({ title: "Role updated" })
      fetchUsers()
    } catch {
      toast({ title: "Failed to update role", variant: "destructive" })
    } finally {
      setSaving(null)
    }
  }

  async function fetchAuditLogs() {
    try {
      const res = await fetch("/api/audit-logs?action=update_role&limit=20")
      const data = await res.json()
      setAuditLogs(data.logs || [])
    } catch {}
  }

  async function handleInvite() {
    setInviteLoading(true)
    setInviteResult(null)
    try {
      const res = await fetch("/api/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      })
      const data = await res.json()
      if (res.ok) {
        setInviteResult("Invitation sent! (Token: " + data.token + ")")
        setInviteEmail("")
        setInviteRole("member")
        fetchUsers()
      } else {
        setInviteResult(data.error || "Failed to send invitation")
      }
    } catch {
      setInviteResult("Failed to send invitation")
    } finally {
      setInviteLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div>Loading users...</div>
        ) : (
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th className="text-left">Name</th>
                <th className="text-left">Email</th>
                <th className="text-left">Role</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.first_name} {user.last_name}</td>
                  <td>{user.email}</td>
                  <td>
                    <Select
                      value={user.role}
                      onValueChange={(val) => handleRoleChange(user.id, val)}
                      disabled={saving === user.id}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {USER_ROLES.map((role) => (
                          <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td>
                    {saving === user.id && <span className="text-xs text-gray-500">Saving...</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {isAdmin && (
          <div className="mb-6">
            <Button onClick={() => setInviteOpen(true)}>Invite User</Button>
            <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto mt-10">
                <h3 className="text-lg font-bold mb-2">Invite New User</h3>
                <Input
                  placeholder="Email address"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  className="mb-2"
                />
                <Select value={inviteRole} onValueChange={setInviteRole}>
                  <SelectTrigger className="w-full mb-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {USER_ROLES.map((role) => (
                      <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleInvite} disabled={inviteLoading || !inviteEmail} className="w-full mt-2">
                  {inviteLoading ? "Sending..." : "Send Invitation"}
                </Button>
                {inviteResult && <div className="mt-2 text-sm text-center">{inviteResult}</div>}
              </div>
            </Dialog>
          </div>
        )}
        {isAdmin && (
          <div className="mt-10">
            <h3 className="text-lg font-bold mb-2">Audit Log (Role Changes)</h3>
            <table className="min-w-full text-xs">
              <thead>
                <tr>
                  <th>Admin</th>
                  <th>Action</th>
                  <th>Target User</th>
                  <th>Old Role</th>
                  <th>New Role</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => (
                  <tr key={log.id}>
                    <td>{log.user_id}</td>
                    <td>{log.action}</td>
                    <td>{log.target_id}</td>
                    <td>{log.details?.oldRole}</td>
                    <td>{log.details?.newRole}</td>
                    <td>{new Date(log.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 