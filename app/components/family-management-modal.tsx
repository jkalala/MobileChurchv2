"use client"

import { useState } from "react"
import { DialogShell } from "./_shared/dialog-shell"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Link, Unlink, Search, Heart, Baby, User } from "lucide-react"
import type { Member } from "@/lib/database"

interface FamilyManagementModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  members: Member[]
}

interface Family {
  id: string
  name: string
  members: Member[]
  head_of_family?: Member
}

export function FamilyManagementModal({ open, onOpenChange, members }: FamilyManagementModalProps) {
  const [families, setFamilies] = useState<Family[]>([
    {
      id: "1",
      name: "Família Silva",
      members: members.slice(0, 3),
      head_of_family: members[0],
    },
    {
      id: "2",
      name: "Família Santos",
      members: members.slice(3, 5),
      head_of_family: members[3],
    },
  ])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFamily, setSelectedFamily] = useState<Family | null>(null)
  const [showCreateFamily, setShowCreateFamily] = useState(false)
  const [newFamilyName, setNewFamilyName] = useState("")
  const [selectedHeadOfFamily, setSelectedHeadOfFamily] = useState("")

  const unassignedMembers = members.filter(
    (member) => !families.some((family) => family.members.some((fm) => fm.id === member.id)),
  )

  const filteredFamilies = families.filter((family) => family.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleCreateFamily = () => {
    if (!newFamilyName.trim()) return

    const headMember = members.find((m) => m.id === selectedHeadOfFamily)
    const newFamily: Family = {
      id: Date.now().toString(),
      name: newFamilyName,
      members: headMember ? [headMember] : [],
      head_of_family: headMember,
    }

    setFamilies([...families, newFamily])
    setNewFamilyName("")
    setSelectedHeadOfFamily("")
    setShowCreateFamily(false)
  }

  const handleAddMemberToFamily = (familyId: string, memberId: string) => {
    const member = members.find((m) => m.id === memberId)
    if (!member) return

    setFamilies(
      families.map((family) => (family.id === familyId ? { ...family, members: [...family.members, member] } : family)),
    )
  }

  const handleRemoveMemberFromFamily = (familyId: string, memberId: string) => {
    setFamilies(
      families.map((family) =>
        family.id === familyId
          ? {
              ...family,
              members: family.members.filter((m) => m.id !== memberId),
              head_of_family: family.head_of_family?.id === memberId ? undefined : family.head_of_family,
            }
          : family,
      ),
    )
  }

  const getRelationshipIcon = (member: Member, family: Family) => {
    if (family.head_of_family?.id === member.id) {
      return <User className="h-4 w-4 text-blue-600" />
    }
    if (member.marital_status === "married") {
      return <Heart className="h-4 w-4 text-red-600" />
    }
    return <Baby className="h-4 w-4 text-green-600" />
  }

  const getRelationshipLabel = (member: Member, family: Family) => {
    if (family.head_of_family?.id === member.id) {
      return "Chefe da Família"
    }
    if (member.marital_status === "married") {
      return "Cônjuge"
    }
    return "Filho(a)"
  }

  return (
    <DialogShell isOpen={open} onClose={() => onOpenChange(false)} title="Family Management">
      <form className="space-y-4">
        <Input placeholder="Primary contact" />
        <Input placeholder="Family name" />
        <Button className="w-full" disabled>
          Save (demo)
        </Button>
      </form>
      <div className="space-y-6 mt-4">
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar famílias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={() => setShowCreateFamily(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Família
          </Button>
        </div>

        {/* Create Family Form */}
        {showCreateFamily && (
          <Card>
            <CardHeader>
              <CardTitle>Criar Nova Família</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Input
                  placeholder="Ex: Família Silva"
                  value={newFamilyName}
                  onChange={(e) => setNewFamilyName(e.target.value)}
                />
              </div>
              <div>
                <Select value={selectedHeadOfFamily} onValueChange={setSelectedHeadOfFamily}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar membro" />
                  </SelectTrigger>
                  <SelectContent>
                    {unassignedMembers.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.first_name} {member.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCreateFamily}>Criar Família</Button>
                <Button variant="outline" onClick={() => setShowCreateFamily(false)}>
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Families List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredFamilies.map((family) => (
            <Card key={family.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{family.name}</span>
                  <Badge variant="secondary">{family.members.length} membros</Badge>
                </CardTitle>
                <CardDescription>
                  {family.head_of_family &&
                    `Chefe: ${family.head_of_family.first_name} ${family.head_of_family.last_name}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {family.members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={member.profile_image || "/placeholder.svg"} />
                          <AvatarFallback className="text-xs">
                            {member.first_name[0]}
                            {member.last_name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">
                            {member.first_name} {member.last_name}
                          </p>
                          <div className="flex items-center gap-1">
                            {getRelationshipIcon(member, family)}
                            <span className="text-xs text-gray-600">{getRelationshipLabel(member, family)}</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveMemberFromFamily(family.id, member.id)}
                      >
                        <Unlink className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}

                  {/* Add Member to Family */}
                  <div className="pt-2 border-t">
                    <Select onValueChange={(memberId) => handleAddMemberToFamily(family.id, memberId)}>
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder="Adicionar membro" />
                      </SelectTrigger>
                      <SelectContent>
                        {unassignedMembers.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            <div className="flex items-center gap-2">
                              <Link className="h-3 w-3" />
                              {member.first_name} {member.last_name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Unassigned Members */}
        {unassignedMembers.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Membros Sem Família</CardTitle>
              <CardDescription>Membros que ainda não foram atribuídos a uma família</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {unassignedMembers.map((member) => (
                  <div key={member.id} className="flex items-center gap-3 p-2 border rounded-lg">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={member.profile_image || "/placeholder.svg"} />
                      <AvatarFallback className="text-xs">
                        {member.first_name[0]}
                        {member.last_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        {member.first_name} {member.last_name}
                      </p>
                      <p className="text-xs text-gray-600">{member.department}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end">
          <Button onClick={() => onOpenChange(false)}>Fechar</Button>
        </div>
      </div>
    </DialogShell>
  )
}

export default FamilyManagementModal
