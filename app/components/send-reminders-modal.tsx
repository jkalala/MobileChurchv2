"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, MessageSquare, Phone, Users, Clock, Send, Eye } from "lucide-react"

interface SendRemindersModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  eventTitle?: string
  eventDate?: string
}

export default function SendRemindersModal({
  open,
  onOpenChange,
  eventTitle = "Culto Dominical",
  eventDate = "2024-01-28",
}: SendRemindersModalProps) {
  const [reminderType, setReminderType] = useState("email")
  const [subject, setSubject] = useState(`Lembrete: ${eventTitle}`)
  const [message, setMessage] = useState("")
  const [selectedGroups, setSelectedGroups] = useState<string[]>([])
  const [scheduleTime, setScheduleTime] = useState("now")
  const [customDateTime, setCustomDateTime] = useState("")
  const [previewMode, setPreviewMode] = useState(false)

  const memberGroups = [
    { id: "all", name: "Todos os Membros", count: 247 },
    { id: "active", name: "Membros Ativos", count: 231 },
    { id: "worship", name: "Ministério de Louvor", count: 25 },
    { id: "youth", name: "Ministério Jovem", count: 45 },
    { id: "children", name: "Ministério Infantil", count: 32 },
    { id: "leaders", name: "Líderes", count: 18 },
  ]

  const reminderTemplates = [
    {
      id: "event_reminder",
      name: "Lembrete de Evento",
      subject: "Lembrete: {event_title}",
      message:
        "Olá {member_name},\n\nEste é um lembrete sobre o evento '{event_title}' que acontecerá em {event_date} às {event_time}.\n\nLocal: {event_location}\n\nEsperamos você lá!\n\nBênçãos,\nEquipe da Igreja",
    },
    {
      id: "service_reminder",
      name: "Lembrete de Culto",
      subject: "Culto de Domingo - {event_date}",
      message:
        "Paz do Senhor, {member_name}!\n\nLembramos que nosso culto de domingo será em {event_date} às {event_time}.\n\nVenha adorar conosco!\n\nDeus abençoe,\nIgreja Semente Bendita",
    },
    {
      id: "meeting_reminder",
      name: "Lembrete de Reunião",
      subject: "Reunião: {event_title}",
      message:
        "Caro(a) {member_name},\n\nLembramos da reunião '{event_title}' marcada para {event_date} às {event_time}.\n\nSua presença é importante!\n\nAtenciosamente,\nLiderança",
    },
  ]

  const handleGroupToggle = (groupId: string) => {
    setSelectedGroups((prev) => (prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]))
  }

  const handleTemplateSelect = (template: any) => {
    setSubject(template.subject)
    setMessage(template.message)
  }

  const getTotalRecipients = () => {
    return selectedGroups.reduce((total, groupId) => {
      const group = memberGroups.find((g) => g.id === groupId)
      return total + (group?.count || 0)
    }, 0)
  }

  const handleSendReminders = () => {
    console.log("Sending reminders:", {
      type: reminderType,
      subject,
      message,
      groups: selectedGroups,
      schedule: scheduleTime,
      customDateTime,
      recipients: getTotalRecipients(),
    })

    // Simulate sending
    setTimeout(() => {
      onOpenChange(false)
      // Show success message
    }, 1000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Enviar Lembretes
          </DialogTitle>
          <DialogDescription>Envie lembretes para membros sobre eventos e atividades da igreja</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="compose" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="compose">Compor</TabsTrigger>
            <TabsTrigger value="recipients">Destinatários</TabsTrigger>
            <TabsTrigger value="schedule">Agendar</TabsTrigger>
          </TabsList>

          <TabsContent value="compose" className="space-y-4">
            {/* Reminder Type */}
            <div className="grid grid-cols-3 gap-4">
              <Card
                className={`cursor-pointer transition-colors ${reminderType === "email" ? "ring-2 ring-blue-500" : ""}`}
                onClick={() => setReminderType("email")}
              >
                <CardContent className="p-4 text-center">
                  <Mail className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <p className="font-medium">Email</p>
                  <p className="text-xs text-gray-600">Envio por email</p>
                </CardContent>
              </Card>

              <Card
                className={`cursor-pointer transition-colors ${reminderType === "sms" ? "ring-2 ring-blue-500" : ""}`}
                onClick={() => setReminderType("sms")}
              >
                <CardContent className="p-4 text-center">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <p className="font-medium">SMS</p>
                  <p className="text-xs text-gray-600">Mensagem de texto</p>
                </CardContent>
              </Card>

              <Card
                className={`cursor-pointer transition-colors ${reminderType === "whatsapp" ? "ring-2 ring-blue-500" : ""}`}
                onClick={() => setReminderType("whatsapp")}
              >
                <CardContent className="p-4 text-center">
                  <Phone className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <p className="font-medium">WhatsApp</p>
                  <p className="text-xs text-gray-600">Mensagem WhatsApp</p>
                </CardContent>
              </Card>
            </div>

            {/* Templates */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Modelos de Mensagem</CardTitle>
                <CardDescription>Escolha um modelo ou crie sua própria mensagem</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {reminderTemplates.map((template) => (
                    <Card
                      key={template.id}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleTemplateSelect(template)}
                    >
                      <CardContent className="p-3">
                        <p className="font-medium text-sm">{template.name}</p>
                        <p className="text-xs text-gray-600 mt-1 truncate">{template.subject}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Message Composition */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="subject">Assunto</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Digite o assunto da mensagem"
                />
              </div>

              <div>
                <Label htmlFor="message">Mensagem</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Digite sua mensagem aqui..."
                  rows={6}
                />
                <p className="text-xs text-gray-600 mt-1">
                  Use {"{member_name}"}, {"{event_title}"}, {"{event_date}"}, {"{event_time}"} para personalização
                </p>
              </div>
            </div>

            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Pré-visualização
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium mb-2">{subject}</p>
                  <div className="text-sm whitespace-pre-wrap">
                    {message
                      .replace(/{member_name}/g, "João Silva")
                      .replace(/{event_title}/g, eventTitle)
                      .replace(/{event_date}/g, new Date(eventDate).toLocaleDateString("pt-BR"))
                      .replace(/{event_time}/g, "10:00")
                      .replace(/{event_location}/g, "Templo Principal")}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recipients" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Selecionar Destinatários
                </CardTitle>
                <CardDescription>Escolha os grupos de membros que receberão o lembrete</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {memberGroups.map((group) => (
                    <div key={group.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id={group.id}
                          checked={selectedGroups.includes(group.id)}
                          onCheckedChange={() => handleGroupToggle(group.id)}
                        />
                        <Label htmlFor={group.id} className="font-medium">
                          {group.name}
                        </Label>
                      </div>
                      <Badge variant="secondary">{group.count} membros</Badge>
                    </div>
                  ))}
                </div>

                {selectedGroups.length > 0 && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-800">
                      Total de destinatários: {getTotalRecipients()} membros
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Agendar Envio
                </CardTitle>
                <CardDescription>Escolha quando enviar os lembretes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="now"
                      name="schedule"
                      value="now"
                      checked={scheduleTime === "now"}
                      onChange={(e) => setScheduleTime(e.target.value)}
                    />
                    <Label htmlFor="now">Enviar agora</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="1hour"
                      name="schedule"
                      value="1hour"
                      checked={scheduleTime === "1hour"}
                      onChange={(e) => setScheduleTime(e.target.value)}
                    />
                    <Label htmlFor="1hour">Enviar em 1 hora</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="1day"
                      name="schedule"
                      value="1day"
                      checked={scheduleTime === "1day"}
                      onChange={(e) => setScheduleTime(e.target.value)}
                    />
                    <Label htmlFor="1day">Enviar em 1 dia</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="custom"
                      name="schedule"
                      value="custom"
                      checked={scheduleTime === "custom"}
                      onChange={(e) => setScheduleTime(e.target.value)}
                    />
                    <Label htmlFor="custom">Data e hora personalizada</Label>
                  </div>

                  {scheduleTime === "custom" && (
                    <div className="ml-6">
                      <Input
                        type="datetime-local"
                        value={customDateTime}
                        onChange={(e) => setCustomDateTime(e.target.value)}
                        min={new Date().toISOString().slice(0, 16)}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Resumo do Envio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Tipo:</span>
                    <span className="font-medium capitalize">{reminderType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Destinatários:</span>
                    <span className="font-medium">{getTotalRecipients()} membros</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Agendamento:</span>
                    <span className="font-medium">
                      {scheduleTime === "now"
                        ? "Agora"
                        : scheduleTime === "1hour"
                          ? "Em 1 hora"
                          : scheduleTime === "1day"
                            ? "Em 1 dia"
                            : "Personalizado"}
                    </span>
                  </div>
                  {scheduleTime === "custom" && customDateTime && (
                    <div className="flex justify-between">
                      <span>Data/Hora:</span>
                      <span className="font-medium">{new Date(customDateTime).toLocaleString("pt-BR")}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleSendReminders}
            disabled={!subject || !message || selectedGroups.length === 0}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="h-4 w-4 mr-2" />
            {scheduleTime === "now" ? "Enviar Agora" : "Agendar Envio"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
