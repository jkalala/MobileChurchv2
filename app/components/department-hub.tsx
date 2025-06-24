"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Plus, Calendar, MapPin, Mail, Activity, Clock, Edit, UserPlus, Settings } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function DepartmentHub() {
  const [activeTab, setActiveTab] = useState("overview")
  const [departments, setDepartments] = useState([
    {
      id: 1,
      name: "Ministério de Louvor",
      type: "worship",
      description: "Responsável pela música e adoração nos cultos",
      leader: "João Silva",
      leaderId: "1",
      memberCount: 15,
      status: "active",
      meetingDay: "Quarta-feira",
      meetingTime: "19:00",
      location: "Sala de Música",
      contactEmail: "louvor@igreja.com",
      contactPhone: "+244 123 456 789",
      goals: "Liderar a congregação em adoração e louvor",
      activities: [
        { id: 1, title: "Ensaio Semanal", date: "2024-01-31", type: "practice" },
        { id: 2, title: "Culto Dominical", date: "2024-02-04", type: "service" },
      ],
    },
    {
      id: 2,
      name: "Ministério Infantil",
      type: "children",
      description: "Cuidado e ensino das crianças",
      leader: "Maria Santos",
      leaderId: "2",
      memberCount: 12,
      status: "active",
      meetingDay: "Domingo",
      meetingTime: "09:00",
      location: "Sala Infantil",
      contactEmail: "infantil@igreja.com",
      contactPhone: "+244 123 456 790",
      goals: "Ensinar e cuidar das crianças da igreja",
      activities: [
        { id: 3, title: "Escola Dominical", date: "2024-02-04", type: "teaching" },
        { id: 4, title: "Atividade Recreativa", date: "2024-02-10", type: "event" },
      ],
    },
    {
      id: 3,
      name: "Grupo de Jovens",
      type: "youth",
      description: "Ministério voltado para jovens e adolescentes",
      leader: "Pedro Lima",
      leaderId: "3",
      memberCount: 25,
      status: "active",
      meetingDay: "Sexta-feira",
      meetingTime: "18:30",
      location: "Auditório",
      contactEmail: "jovens@igreja.com",
      contactPhone: "+244 123 456 791",
      goals: "Discipular jovens e adolescentes",
      activities: [
        { id: 5, title: "Reunião de Jovens", date: "2024-02-02", type: "meeting" },
        { id: 6, title: "Retiro de Jovens", date: "2024-02-15", type: "retreat" },
      ],
    },
  ])

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState(null)

  const departmentTypes = [
    { value: "worship", label: "Ministério de Louvor" },
    { value: "children", label: "Ministério Infantil" },
    { value: "youth", label: "Ministério Jovem" },
    { value: "women", label: "Ministério Feminino" },
    { value: "men", label: "Ministério Masculino" },
    { value: "evangelism", label: "Evangelismo" },
    { value: "intercession", label: "Intercessão" },
    { value: "ushers", label: "Recepção" },
    { value: "media", label: "Mídia" },
    { value: "administration", label: "Administração" },
  ]

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "worship":
        return "🎵"
      case "children":
        return "👶"
      case "youth":
        return "🧑‍🎓"
      case "women":
        return "👩"
      case "men":
        return "👨"
      case "evangelism":
        return "📢"
      case "intercession":
        return "🙏"
      case "ushers":
        return "🤝"
      case "media":
        return "📹"
      case "administration":
        return "📋"
      default:
        return "📁"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-red-100 text-red-800"
      case "planning":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const totalMembers = departments.reduce((sum, dept) => sum + dept.memberCount, 0)
  const activeDepartments = departments.filter((d) => d.status === "active").length

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Centro de Departamentos</h2>
          <p className="text-gray-600">Gerencie os ministérios e departamentos da igreja</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Departamento
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Departamentos</p>
                <p className="text-2xl font-bold">{departments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Departamentos Ativos</p>
                <p className="text-2xl font-bold">{activeDepartments}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Membros</p>
                <p className="text-2xl font-bold">{totalMembers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="departments">Departamentos</TabsTrigger>
          <TabsTrigger value="activities">Atividades</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Department Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Departamentos por Tipo</CardTitle>
                <CardDescription>Distribuição dos ministérios</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {departmentTypes.slice(0, 6).map((type) => {
                    const count = departments.filter((d) => d.type === type.value).length
                    return (
                      <div key={type.value} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getTypeIcon(type.value)}</span>
                          <span className="text-sm">{type.label}</span>
                        </div>
                        <Badge variant="secondary">{count}</Badge>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle>Atividades Recentes</CardTitle>
                <CardDescription>Últimas atividades dos departamentos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {departments
                    .flatMap((d) => d.activities)
                    .slice(0, 5)
                    .map((activity) => (
                      <div key={activity.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.title}</p>
                          <p className="text-xs text-gray-600">{new Date(activity.date).toLocaleDateString("pt-BR")}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {activity.type}
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="departments" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {departments.map((department) => (
              <Card key={department.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getTypeIcon(department.type)}</span>
                      <div>
                        <CardTitle className="text-lg">{department.name}</CardTitle>
                        <CardDescription>{department.description}</CardDescription>
                      </div>
                    </div>
                    <Badge className={getStatusColor(department.status)}>{department.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Leader Info */}
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>{department.leader[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{department.leader}</p>
                      <p className="text-xs text-gray-600">Líder</p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Membros</p>
                      <p className="font-medium">{department.memberCount}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Reuniões</p>
                      <p className="font-medium">{department.meetingDay}</p>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-1 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {department.meetingDay} às {department.meetingTime}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {department.location}
                    </div>
                    {department.contactEmail && (
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {department.contactEmail}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Edit className="h-3 w-3 mr-1" />
                      Editar
                    </Button>
                    <Button size="sm" variant="outline">
                      <Users className="h-3 w-3 mr-1" />
                      Membros
                    </Button>
                    <Button size="sm" variant="outline">
                      <Settings className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activities" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Cronograma de Atividades</CardTitle>
              <CardDescription>Todas as atividades dos departamentos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departments
                  .flatMap((d) =>
                    d.activities.map((activity) => ({
                      ...activity,
                      departmentName: d.name,
                      departmentType: d.type,
                    })),
                  )
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <p className="text-lg font-bold">{new Date(activity.date).getDate()}</p>
                          <p className="text-xs text-gray-600">
                            {new Date(activity.date).toLocaleDateString("pt-BR", { month: "short" })}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium">{activity.title}</p>
                          <p className="text-sm text-gray-600">{activity.departmentName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{activity.type}</Badge>
                        <span className="text-lg">{getTypeIcon(activity.departmentType)}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Participação por Departamento</CardTitle>
                <CardDescription>Número de membros ativos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departments.map((dept) => (
                    <div key={dept.id} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{dept.name}</span>
                        <span>{dept.memberCount} membros</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${(dept.memberCount / Math.max(...departments.map((d) => d.memberCount))) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Atividades por Mês</CardTitle>
                <CardDescription>Frequência de atividades</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">Gráfico de atividades será exibido aqui</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Department Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Criar Novo Departamento</DialogTitle>
            <DialogDescription>Adicione um novo ministério ou departamento à igreja</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome do Departamento</Label>
                <Input id="name" placeholder="Ex: Ministério de Louvor" />
              </div>
              <div>
                <Label htmlFor="type">Tipo</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {departmentTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {getTypeIcon(type.value)} {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea id="description" placeholder="Descreva o propósito do departamento" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="meetingDay">Dia da Reunião</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar dia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sunday">Domingo</SelectItem>
                    <SelectItem value="monday">Segunda-feira</SelectItem>
                    <SelectItem value="tuesday">Terça-feira</SelectItem>
                    <SelectItem value="wednesday">Quarta-feira</SelectItem>
                    <SelectItem value="thursday">Quinta-feira</SelectItem>
                    <SelectItem value="friday">Sexta-feira</SelectItem>
                    <SelectItem value="saturday">Sábado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="meetingTime">Horário</Label>
                <Input id="meetingTime" type="time" />
              </div>
            </div>

            <div>
              <Label htmlFor="location">Local</Label>
              <Input id="location" placeholder="Ex: Sala de Música" />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setShowCreateModal(false)}>Criar Departamento</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
