"use client"

import { DialogShell } from "./_shared/dialog-shell"
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Calendar, Mail, Phone, MapPin, User, Briefcase, Heart, MessageSquare } from "lucide-react"

interface ViewMemberModalProps {
  memberId: string
}

export function ViewMemberModal({ memberId }: ViewMemberModalProps) {
  const member = {
    id: memberId,
    name: "Sample Member",
    first_name: "John",
    last_name: "Doe",
    email: "john@example.com",
    phone: "+1234567890",
    address: "123 Main St",
    gender: "male",
    marital_status: "single",
    occupation: "Engineer",
    department: "IT",
    emergency_contact: "Jane Doe",
    notes: "Sample notes",
    member_status: "active",
    profile_image: "/placeholder.svg",
    date_of_birth: "1990-01-01",
    baptism_date: "2020-01-01",
    join_date: "2020-01-01",
  }

  if (!member) return null

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

  const calculateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return null
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  return (
    <DialogShell title="Member Details" triggerLabel="View">
      <p className="font-medium">ID: {member.id}</p>
      <p className="truncate">Name: {member.name}</p>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes do Membro</DialogTitle>
          <DialogDescription>Informações completas do membro</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header with Avatar and Basic Info */}
          <div className="flex items-start space-x-4">
            <Avatar className="w-20 h-20">
              <AvatarImage
                src={member.profile_image || "/placeholder.svg"}
                alt={member.first_name + " " + member.last_name}
              />
              <AvatarFallback className="text-lg">
                {member.first_name[0]}
                {member.last_name[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-2xl font-bold">
                {member.first_name} {member.last_name}
              </h3>
              <p className="text-gray-600">{member.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={getStatusColor(member.member_status)}>
                  {member.member_status === "active"
                    ? "Ativo"
                    : member.member_status === "inactive"
                      ? "Inativo"
                      : "Pendente"}
                </Badge>
                {member.department && <Badge variant="secondary">{member.department}</Badge>}
              </div>
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Informações de Contato
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {member.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>{member.email}</span>
                </div>
              )}
              {member.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{member.phone}</span>
                </div>
              )}
              {member.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{member.address}</span>
                </div>
              )}
              {member.emergency_contact && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-red-400" />
                  <span>Emergência: {member.emergency_contact}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informações Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {member.date_of_birth && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>
                    Nascimento: {new Date(member.date_of_birth).toLocaleDateString("pt-BR")}
                    {calculateAge(member.date_of_birth) && ` (${calculateAge(member.date_of_birth)} anos)`}
                  </span>
                </div>
              )}
              {member.gender && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span>Gênero: {member.gender === "male" ? "Masculino" : "Feminino"}</span>
                </div>
              )}
              {member.marital_status && (
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-gray-400" />
                  <span>
                    Estado Civil:{" "}
                    {member.marital_status === "single"
                      ? "Solteiro"
                      : member.marital_status === "married"
                        ? "Casado"
                        : member.marital_status === "divorced"
                          ? "Divorciado"
                          : "Viúvo"}
                  </span>
                </div>
              )}
              {member.occupation && (
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-gray-400" />
                  <span>Profissão: {member.occupation}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Church Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Informações da Igreja
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span>Membro desde: {new Date(member.join_date).toLocaleDateString("pt-BR")}</span>
              </div>
              {member.baptism_date && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-400" />
                  <span>Batizado em: {new Date(member.baptism_date).toLocaleDateString("pt-BR")}</span>
                </div>
              )}
              {member.department && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span>Departamento: {member.department}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notes */}
          {member.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Observações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{member.notes}</p>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end">
            <Button onClick={() => window.close()}>Fechar</Button>
          </div>
        </div>
      </DialogContent>
    </DialogShell>
  )
}

export default ViewMemberModal
