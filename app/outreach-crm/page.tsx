import type { Metadata } from "next"
import OutreachCRMDashboard from "@/app/components/outreach-crm-dashboard"

export const metadata: Metadata = {
  title: "Community Outreach CRM | Smart Church App",
  description: "Manage community relationships and outreach programs effectively",
}

export default function OutreachCRMPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <OutreachCRMDashboard />
      </div>
    </div>
  )
}
