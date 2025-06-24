"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  FileText,
  UserCheck,
  Mail,
  Phone,
  Edit,
  Trash2,
  Share2,
} from "lucide-react"

interface ViewEventModalProps {
  isOpen: boolean
  onClose: () => void
  event: any
  onEdit: () => void
  onDelete: () => void
}

export default function ViewEventModal({ isOpen, onClose, event, onEdit, onDelete }: ViewEventModalProps) {
  if (!event) return null

  const getEventTypeColor = (type: string) => {
    const colors = {
      service: "bg-blue-100 text-blue-800",
      meeting: "bg-green-100 text-green-800",
      practice: "bg-purple-100 text-purple-800",
      outreach: "bg-orange-100 text-orange-800",
      fellowship: "bg-pink-100 text-pink-800",
      conference: "bg-indigo-100 text-indigo-800",
      workshop: "bg-yellow-100 text-yellow-800",
      prayer: "bg-gray-100 text-gray-800",
      youth: "bg-red-100 text-red-800",
      children: "bg-cyan-100 text-cyan-800",
    }
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const getEventTypeLabel = (type: string) => {
    const labels = {
      service: "Culto/Serviço",
      meeting: "Reunião",
      practice: "Ensaio",
      outreach: "Evangelismo",
      fellowship: "Confraternização",
      conference: "Conferência",
      workshop: "Workshop",
      prayer: "Vigília/Oração",
      youth: "Evento Jovens",
      children: "Evento Crianças",
    }
    return labels[type as keyof typeof labels] || type
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-AO", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (timeString: string) => {
    if (!timeString) return "Não definido"
    return timeString
  }

  // Mock RSVP data - in real app, this would come from the database
  const mockRSVPs = [
    {
      id: "1",
      member: { first_name: "João", last_name: "Silva", email: "joao@email.com", phone: "+244 923 456 789" },
      rsvp_status: "confirmed",
      rsvp_date: "2024-01-15",
    },
    {
      id: "2",
      member: { first_name: "Maria", last_name: "Santos", email: "maria@email.com", phone: "+244 912 345 678" },
      rsvp_status: "confirmed",
      rsvp_date: "2024-01-16",
    },
    {
      id: "3",
      member: { first_name: "Pedro", last_name: "Costa", email: "pedro@email.com", phone: "+244 934 567 890" },
      rsvp_status: "maybe",
      rsvp_date: "2024-01-17",
    },
  ]

  const confirmedCount = mockRSVPs.filter((rsvp) => rsvp.status === "confirmed").length
  const maybeCount = mockRSVPs.filter((rsvp) => rsvp.status === "maybe").length

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold">{event.title}</DialogTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={getEventTypeColor(event.event_type)}>{getEventTypeLabel(event.event_type)}</Badge>
                <Badge variant="outline">
                  {event.registration_required ? "Inscrição Obrigatória" : "Entrada Livre"}
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Compartilhar
              </Button>
              <Button variant="destructive" size="sm" onClick={onDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </Button>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">Detalhes</TabsTrigger>
            <TabsTrigger value="attendees">Participantes</TabsTrigger>
            <TabsTrigger value="logistics">Logística</TabsTrigger>
            <TabsTrigger value="communications">Comunicações</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Event Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Informações do Evento
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="font-medium">Data</p>
                      <p className="text-sm text-gray-600">{formatDate(event.event_date)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="font-medium">Horário</p>
                      <p className="text-sm text-gray-600">
                        {formatTime(event.start_time)} - {formatTime(event.end_time)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="font-medium">Local</p>
                      <p className="text-sm text-gray-600">{event.location || "A definir"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="font-medium">Capacidade</p>
                      <p className="text-sm text-gray-600">
                        {event.max_capacity ? `${event.max_capacity} pessoas` : "Ilimitada"}
                      </p>
                    </div>
                  </div>

                  {event.cost && (
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="font-medium">Custo</p>
                        <p className="text-sm text-gray-600">{event.cost} Kz</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Description and Notes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Descrição
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {event.description || "Nenhuma descrição fornecida."}
                  </p>
                  {event.notes && (
                    <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                      <p className="text-sm font-medium text-yellow-800">Notas Internas:</p>
                      <p className="text-sm text-yellow-700 mt-1">{event.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Registration Information */}
            {event.registration_required && (
              <Card>
                <CardHeader>
                  <CardTitle>Informações de Inscrição</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{confirmedCount}</p>
                      <p className="text-sm text-green-700">Confirmados</p>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <p className="text-2xl font-bold text-yellow-600">{maybeCount}</p>
                      <p className="text-sm text-yellow-700">Talvez</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-600">
                        {event.max_capacity ? event.max_capacity - confirmedCount : "∞"}
                      </p>
                      <p className="text-sm text-gray-700">Vagas Restantes</p>
                    </div>
                  </div>
                  {event.registration_deadline && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-800">
                        Prazo de inscrição: {formatDate(event.registration_deadline)}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="attendees" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5" />
                  Lista de Participantes
                </CardTitle>
                <CardDescription>Membros que confirmaram presença no evento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockRSVPs.map((rsvp) => (
                    <div key={rsvp.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                          <span className="text-indigo-600 font-medium">
                            {rsvp.member.first_name[0]}
                            {rsvp.member.last_name[0]}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">
                            {rsvp.member.first_name} {rsvp.member.last_name}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {rsvp.member.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {rsvp.member.phone}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          className={
                            rsvp.rsvp_status === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : rsvp.rsvp_status === "maybe"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }
                        >
                          {rsvp.rsvp_status === "confirmed"
                            ? "Confirmado"
                            : rsvp.rsvp_status === "maybe"
                              ? "Talvez"
                              : "Cancelado"}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">
                          RSVP: {new Date(rsvp.rsvp_date).toLocaleDateString("pt-AO")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logistics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Checklist de Preparação</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      "Reservar local",
                      "Confirmar equipamentos de som",
                      "Preparar materiais",
                      "Enviar lembretes",
                      "Organizar recepção",
                      "Preparar lanche (se aplicável)",
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recursos Necessários</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p>• Sistema de som</p>
                    <p>• Projetor/Telão</p>
                    <p>• Cadeiras para {event.max_capacity || "todos"} participantes</p>
                    <p>• Material de apoio</p>
                    <p>• Equipe de recepção (2-3 pessoas)</p>
                    <p>• Limpeza pós-evento</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="communications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Comunicações</CardTitle>
                <CardDescription>Lembretes e comunicados enviados para este evento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-blue-900">Convite Inicial</p>
                        <p className="text-sm text-blue-700">Enviado para todos os membros ativos</p>
                      </div>
                      <span className="text-xs text-blue-600">Há 5 dias</span>
                    </div>
                  </div>

                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-yellow-900">Lembrete 1</p>
                        <p className="text-sm text-yellow-700">Lembrete enviado 3 dias antes do evento</p>
                      </div>
                      <span className="text-xs text-yellow-600">Há 2 dias</span>
                    </div>
                  </div>

                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-green-900">Lembrete Final</p>
                        <p className="text-sm text-green-700">Lembrete final com detalhes do evento</p>
                      </div>
                      <span className="text-xs text-green-600">Hoje</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t">
                  <Button className="w-full">
                    <Mail className="h-4 w-4 mr-2" />
                    Enviar Novo Comunicado
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
