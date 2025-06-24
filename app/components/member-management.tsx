"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  Grid3X3,
  List,
  LayoutGrid,
  TableIcon,
  Contact,
  SortAsc,
  SortDesc,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Cake,
  Building2,
  Camera,
} from "lucide-react"
import { DatabaseService, type Member } from "@/lib/database"
import { AddMemberModal } from "./add-member-modal"
import { EditMemberModal } from "./edit-member-modal"
import { ViewMemberModal } from "./view-member-modal"
import { MemberBulkActions } from "./member-bulk-actions"
import { FaceRecognitionModal } from "./face-recognition-modal"
import { FamilyManagementModal } from "./family-management-modal"
import { GPSCheckInModal } from "./gps-checkin-modal"
import { useTranslation, type Language } from "@/lib/i18n"
import { useAuth } from "@/components/auth-provider"
import { bulkUpdateMemberStatus, bulkAssignDepartment, bulkDeleteMembersClient } from "@/lib/actions"
import { toast } from "@/components/ui/use-toast"
import { DepartmentSelectModal } from "./department-select-modal"

type ViewMode = "cards" | "table" | "grid" | "list" | "compact" | "contact"
type SortField = "name" | "email" | "joinDate" | "department" | "status"
type SortOrder = "asc" | "desc"

interface MemberManagementProps {
  language?: Language
}

export default function MemberManagement({ language = "pt" }: MemberManagementProps) {
  const { t } = useTranslation(language)
  const { userProfile } = useAuth()
  const userRole = userProfile?.role || "member"
  const [members, setMembers] = useState<Member[]>([])
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [viewMode, setViewMode] = useState<ViewMode>("cards")
  const [sortField, setSortField] = useState<SortField>("name")
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc")
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [showFaceRecognition, setShowFaceRecognition] = useState(false)
  const [showFamilyManagement, setShowFamilyManagement] = useState(false)
  const [showGPSCheckIn, setShowGPSCheckIn] = useState(false)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [showDeptModal, setShowDeptModal] = useState(false)

  // Load members on component mount
  useEffect(() => {
    loadMembers()
  }, [])

  // Filter and sort members when dependencies change
  useEffect(() => {
    filterAndSortMembers()
  }, [members, searchTerm, activeTab, sortField, sortOrder])

  const loadMembers = async () => {
    try {
      setLoading(true)
      const data = await DatabaseService.getMembers()
      setMembers(data)
    } catch (error) {
      console.error("Error loading members:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortMembers = () => {
    let filtered = members

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (member) =>
          member.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.phone?.includes(searchTerm),
      )
    }

    // Apply status filter
    if (activeTab !== "all") {
      filtered = filtered.filter((member) => member.member_status === activeTab)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: string | number
      let bValue: string | number

      switch (sortField) {
        case "name":
          aValue = `${a.first_name} ${a.last_name}`.toLowerCase()
          bValue = `${b.first_name} ${b.last_name}`.toLowerCase()
          break
        case "email":
          aValue = a.email?.toLowerCase() || ""
          bValue = b.email?.toLowerCase() || ""
          break
        case "joinDate":
          aValue = new Date(a.join_date).getTime()
          bValue = new Date(b.join_date).getTime()
          break
        case "department":
          aValue = a.department?.toLowerCase() || ""
          bValue = b.department?.toLowerCase() || ""
          break
        case "status":
          aValue = a.member_status?.toLowerCase() || ""
          bValue = b.member_status?.toLowerCase() || ""
          break
        default:
          aValue = ""
          bValue = ""
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    setFilteredMembers(filtered)
  }

  const getMemberStats = () => {
    const total = members.length
    const active = members.filter((m) => m.member_status === "active").length
    const inactive = members.filter((m) => m.member_status === "inactive").length
    const newThisMonth = members.filter((m) => {
      const joinDate = new Date(m.join_date)
      const now = new Date()
      return joinDate.getMonth() === now.getMonth() && joinDate.getFullYear() === now.getFullYear()
    }).length

    const departments = new Set(members.map((m) => m.department)).size
    const birthdaysThisMonth = members.filter((m) => {
      if (!m.date_of_birth) return false
      const birthDate = new Date(m.date_of_birth)
      const now = new Date()
      return birthDate.getMonth() === now.getMonth()
    }).length

    return { total, active, inactive, newThisMonth, departments, birthdaysThisMonth }
  }

  const stats = getMemberStats()

  const handleAddMember = (memberData: Partial<Member>) => {
    // Ensure id is string if present
    if (memberData.id && typeof memberData.id === 'number') {
      memberData.id = String(memberData.id)
    }
    // Ensure department is always a string
    if (typeof memberData.department === 'undefined') {
      memberData.department = ''
    }
    // Call the async function
    (async () => {
      await addMemberAsync(memberData)
    })()
  }

  const addMemberAsync = async (memberData: Partial<Member>) => {
    // Ensure id is string if present
    if (memberData.id && typeof memberData.id === 'number') {
      memberData.id = String(memberData.id)
    }
    // Ensure department is always a string
    if (typeof memberData.department === 'undefined') {
      memberData.department = ''
    }
    try {
      const newMember = await DatabaseService.createMember(memberData)
      setMembers([newMember, ...members])
      setShowAddModal(false)
    } catch (error) {
      console.error("Error adding member:", error)
    }
  }

  const handleEditMember = async (memberData: Partial<Member>) => {
    if (!selectedMember) return

    try {
      const updatedMember = await DatabaseService.updateMember(selectedMember.id, memberData)
      setMembers(members.map((m) => (m.id === selectedMember.id ? updatedMember : m)))
      setShowEditModal(false)
      setSelectedMember(null)
    } catch (error) {
      console.error("Error updating member:", error)
    }
  }

  const handleDeleteMember = async (memberId: string) => {
    try {
      await DatabaseService.deleteMember(memberId)
      setMembers(members.filter((m) => m.id !== memberId))
    } catch (error) {
      console.error("Error deleting member:", error)
    }
  }

  const handleBulkAction = async (action: string, memberIds: string[]) => {
    // Bulk actions not implemented in DatabaseService; show a toast or log for now
    console.warn(`Bulk action '${action}' requested for members:`, memberIds)
    loadMembers()
    setSelectedMembers([])
    setShowBulkActions(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === "pt" ? "pt-BR" : language === "es" ? "es-ES" : "en-US")
  }

  const ViewModeSelector = () => (
    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
      <Button
        variant={viewMode === "cards" ? "default" : "ghost"}
        size="sm"
        onClick={() => setViewMode("cards")}
        className="h-8 w-8 p-0"
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
      <Button
        variant={viewMode === "table" ? "default" : "ghost"}
        size="sm"
        onClick={() => setViewMode("table")}
        className="h-8 w-8 p-0"
      >
        <TableIcon className="h-4 w-4" />
      </Button>
      <Button
        variant={viewMode === "grid" ? "default" : "ghost"}
        size="sm"
        onClick={() => setViewMode("grid")}
        className="h-8 w-8 p-0"
      >
        <Grid3X3 className="h-4 w-4" />
      </Button>
      <Button
        variant={viewMode === "list" ? "default" : "ghost"}
        size="sm"
        onClick={() => setViewMode("list")}
        className="h-8 w-8 p-0"
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant={viewMode === "contact" ? "default" : "ghost"}
        size="sm"
        onClick={() => setViewMode("contact")}
        className="h-8 w-8 p-0"
      >
        <Contact className="h-4 w-4" />
      </Button>
    </div>
  )

  const SortSelector = () => (
    <div className="flex items-center gap-2">
      <Select value={sortField} onValueChange={(value: SortField) => setSortField(value)}>
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="name">{t("members.sortBy.name")}</SelectItem>
          <SelectItem value="email">{t("members.sortBy.email")}</SelectItem>
          <SelectItem value="joinDate">{t("members.sortBy.joinDate")}</SelectItem>
          <SelectItem value="department">{t("members.sortBy.department")}</SelectItem>
          <SelectItem value="status">{t("members.sortBy.status")}</SelectItem>
        </SelectContent>
      </Select>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
        className="h-9 w-9 p-0"
      >
        {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
      </Button>
    </div>
  )

  const renderCardsView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          checked={selectedMembers.length === members.length}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedMembers(members.map(m => m.id))
            } else {
              setSelectedMembers([])
            }
          }}
        />
        <span>Select All</span>
      </div>
      {filteredMembers.map((member) => (
        <Card key={member.id} className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={member.profile_image || "/placeholder.svg"}
                  alt={`${member.first_name} ${member.last_name}`}
                />
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  {member.first_name[0]}
                  {member.last_name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">
                  {member.first_name} {member.last_name}
                </h3>
                <p className="text-sm text-gray-500 truncate">{member.email}</p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="h-3 w-3" />
                <span>{member.phone || t("common.notProvided")}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Building2 className="h-3 w-3" />
                <span>{member.department || t("common.notAssigned")}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(member.join_date)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Badge className={getStatusColor(member.member_status)}>
                {member.member_status === "active" ? t("members.status.active") : t("members.status.inactive")}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedMember(member)
                      setShowViewModal(true)
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {t("common.view")}
                  </DropdownMenuItem>
                  {userRole === "admin" && (
                    <>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedMember(member)
                          setShowEditModal(true)
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        {t("common.edit")}
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteMember(member.id)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        {t("common.delete")}
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const renderTableView = () => (
    <div className="max-h-[60vh] overflow-y-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("members.fields.member")}</TableHead>
            <TableHead>{t("members.fields.contact")}</TableHead>
            <TableHead>{t("members.fields.department")}</TableHead>
            <TableHead>{t("members.fields.status")}</TableHead>
            <TableHead>{t("members.fields.joinDate")}</TableHead>
            <TableHead className="text-right">{t("common.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <div className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              checked={selectedMembers.length === members.length}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedMembers(members.map(m => m.id))
                } else {
                  setSelectedMembers([])
                }
              }}
            />
            <span>Select All</span>
          </div>
          {filteredMembers.map((member) => (
            <TableRow key={member.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={member.profile_image || "/placeholder.svg"}
                      alt={`${member.first_name} ${member.last_name}`}
                    />
                    <AvatarFallback>
                      {member.first_name[0]}
                      {member.last_name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {member.first_name} {member.last_name}
                    </p>
                    <p className="text-sm text-gray-500">{member.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="text-sm">{member.email}</p>
                  <p className="text-sm text-gray-500">{member.phone}</p>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{member.department}</Badge>
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(member.member_status)}>
                  {member.member_status === "active" ? t("members.status.active") : t("members.status.inactive")}
                </Badge>
              </TableCell>
              <TableCell>{formatDate(member.join_date)}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedMember(member)
                        setShowViewModal(true)
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      {t("common.view")}
                    </DropdownMenuItem>
                    {userRole === "admin" && (
                      <>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedMember(member)
                            setShowEditModal(true)
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          {t("common.edit")}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteMember(member.id)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          {t("common.delete")}
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )

  const renderGridView = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
      <div className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          checked={selectedMembers.length === members.length}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedMembers(members.map(m => m.id))
            } else {
              setSelectedMembers([])
            }
          }}
        />
        <span>Select All</span>
      </div>
      {filteredMembers.map((member) => (
        <Card
          key={member.id}
          className="hover:shadow-lg transition-shadow duration-200 cursor-pointer"
          onClick={() => {
            setSelectedMember(member)
            setShowViewModal(true)
          }}
        >
          <CardContent className="p-4 text-center">
            <Avatar className="h-16 w-16 mx-auto mb-3">
              <AvatarImage
                src={member.profile_image || "/placeholder.svg"}
                alt={`${member.first_name} ${member.last_name}`}
              />
              <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
                {member.first_name[0]}
                {member.last_name[0]}
              </AvatarFallback>
            </Avatar>
            <h3 className="font-semibold text-sm text-gray-900 truncate">
              {member.first_name} {member.last_name}
            </h3>
            <p className="text-xs text-gray-500 truncate">{member.department}</p>
            <Badge className={`${getStatusColor(member.member_status)} mt-2 text-xs`}>
              {member.member_status === "active" ? t("members.status.active") : t("members.status.inactive")}
            </Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const renderListView = () => (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          checked={selectedMembers.length === members.length}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedMembers(members.map(m => m.id))
            } else {
              setSelectedMembers([])
            }
          }}
        />
        <span>Select All</span>
      </div>
      {filteredMembers.map((member) => (
        <Card key={member.id} className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={member.profile_image || "/placeholder.svg"}
                    alt={`${member.first_name} ${member.last_name}`}
                  />
                  <AvatarFallback>
                    {member.first_name[0]}
                    {member.last_name[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {member.first_name} {member.last_name}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {member.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {member.phone}
                    </span>
                    <span>{member.department}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(member.member_status)}>
                  {member.member_status === "active" ? t("members.status.active") : t("members.status.inactive")}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedMember(member)
                        setShowViewModal(true)
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      {t("common.view")}
                    </DropdownMenuItem>
                    {userRole === "admin" && (
                      <>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedMember(member)
                            setShowEditModal(true)
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          {t("common.edit")}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteMember(member.id)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          {t("common.delete")}
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const renderContactView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          checked={selectedMembers.length === members.length}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedMembers(members.map(m => m.id))
            } else {
              setSelectedMembers([])
            }
          }}
        />
        <span>Select All</span>
      </div>
      {filteredMembers.map((member) => (
        <Card key={member.id} className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="text-center mb-4">
              <Avatar className="h-20 w-20 mx-auto mb-3">
                <AvatarImage
                  src={member.profile_image || "/placeholder.svg"}
                  alt={`${member.first_name} ${member.last_name}`}
                />
                <AvatarFallback className="bg-blue-100 text-blue-600 text-xl">
                  {member.first_name[0]}
                  {member.last_name[0]}
                </AvatarFallback>
              </Avatar>
              <h3 className="font-bold text-lg text-gray-900">
                {member.first_name} {member.last_name}
              </h3>
              <p className="text-gray-500">{member.department}</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">{member.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">{member.phone || t("common.notProvided")}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">{member.address || t("common.notProvided")}</span>
              </div>
              {member.date_of_birth && (
                <div className="flex items-center gap-3 text-sm">
                  <Cake className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{formatDate(member.date_of_birth)}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">
                  {t("members.joinedOn")} {formatDate(member.join_date)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <Badge className={getStatusColor(member.member_status)}>
                {member.member_status === "active" ? t("members.status.active") : t("members.status.inactive")}
              </Badge>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedMember(member)
                    setShowViewModal(true)
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                {userRole === "admin" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedMember(member)
                      setShowEditModal(true)
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const renderCurrentView = () => {
    switch (viewMode) {
      case "table":
        return renderTableView()
      case "grid":
        return renderGridView()
      case "list":
        return renderListView()
      case "contact":
        return renderContactView()
      default:
        return renderCardsView()
    }
  }

  const handleBulkActivate = async () => {
    await bulkUpdateMemberStatus(selectedMembers, "active")
    await loadMembers()
    setSelectedMembers([])
    toast({ title: "Members activated!" })
  }

  const handleBulkDeactivate = async () => {
    await bulkUpdateMemberStatus(selectedMembers, "inactive")
    await loadMembers()
    setSelectedMembers([])
    toast({ title: "Members deactivated!" })
  }

  const handleBulkAssignDepartment = async (department?: string) => {
    let dept = department
    if (!dept) {
      setShowDeptModal(true)
      return
    }
    await bulkAssignDepartment(selectedMembers, dept)
    await loadMembers()
    setSelectedMembers([])
    toast({ title: "Department assigned." })
  }

  const handleBulkDelete = async () => {
    if (!window.confirm("Are you sure you want to delete the selected members?")) return
    await bulkDeleteMembersClient(selectedMembers)
    await loadMembers()
    setSelectedMembers([])
    toast({ title: "Members deleted." })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t("members.title")}</h2>
          <p className="text-gray-600">{t("members.description")}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            {t("members.actions.import")}
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            {t("members.actions.export")}
          </Button>
          {userRole === "admin" && (
            <Button onClick={() => setShowAddModal(true)} className="mb-4">
              Add Member
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t("members.stats.total")}</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t("members.stats.active")}</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <div className="text-sm font-medium text-green-600">+12</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t("members.stats.inactive")}</p>
                <p className="text-2xl font-bold text-red-600">{stats.inactive}</p>
              </div>
              <div className="text-sm font-medium text-red-600">-3</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t("members.stats.departments")}</p>
                <p className="text-2xl font-bold text-gray-900">{stats.departments}</p>
              </div>
              <Building2 className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t("members.stats.newThisMonth")}</p>
                <p className="text-2xl font-bold text-blue-600">{stats.newThisMonth}</p>
              </div>
              <div className="text-sm font-medium text-blue-600">+{stats.newThisMonth}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t("members.stats.birthdays")}</p>
                <p className="text-2xl font-bold text-orange-600">{stats.birthdaysThisMonth}</p>
              </div>
              <Cake className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={t("members.search.placeholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <ViewModeSelector />
              <SortSelector />
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                {t("common.filters")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Members Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {t("members.list.title")}
          </CardTitle>
          <CardDescription>{t("members.list.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">
                {t("members.tabs.all")} ({stats.total})
              </TabsTrigger>
              <TabsTrigger value="active">
                {t("members.tabs.active")} ({stats.active})
              </TabsTrigger>
              <TabsTrigger value="inactive">
                {t("members.tabs.inactive")} ({stats.inactive})
              </TabsTrigger>
              <TabsTrigger value="new">
                {t("members.tabs.new")} ({stats.newThisMonth})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-4">
              {renderCurrentView()}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Modals */}
      <AddMemberModal 
        open={showAddModal} 
        onOpenChange={setShowAddModal} 
        onSubmit={(memberData) => {
          const { id, ...rest } = memberData;
          handleAddMember({
            ...rest,
            id: id !== undefined ? String(id) : undefined,
          });
        }} 
      />

      {selectedMember && (
        <>
          <EditMemberModal memberId={String(selectedMember.id)} />
          <ViewMemberModal memberId={String(selectedMember.id)} />
        </>
      )}

      <MemberBulkActions
        open={showBulkActions}
        onOpenChange={setShowBulkActions}
        selectedMembers={selectedMembers.map(String)}
      />

      <Button variant="outline" size="sm" onClick={() => setShowFaceRecognition(true)}>
        <Camera className="h-4 w-4 mr-2" />
        Face Recognition
      </Button>

      {showFaceRecognition && (
        <FaceRecognitionModal 
          members={members.map(m => ({ ...m, department: m.department || '' }))}
          onClose={() => setShowFaceRecognition(false)}
        />
      )}

      <FamilyManagementModal 
        open={showFamilyManagement}
        onOpenChange={setShowFamilyManagement}
        members={members.map(m => ({ ...m, department: m.department || '' }))}
      />
      <Button variant="outline" size="sm" onClick={() => setShowGPSCheckIn(true)}>
        <MapPin className="h-4 w-4 mr-2" />
        GPS Check-in
      </Button>

      {showGPSCheckIn && (
        <GPSCheckInModal 
          members={members.map(m => ({ ...m, department: m.department || '' }))}
          onClose={() => setShowGPSCheckIn(false)}
        />
      )}

      <DepartmentSelectModal
        open={showDeptModal}
        onOpenChange={setShowDeptModal}
        onSelect={handleBulkAssignDepartment}
      />
    </div>
  )
}
