"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Heart,
  Users,
  MapPin,
  Calendar,
  Target,
  TrendingUp,
  Plus,
  Eye,
  Edit,
  Share2,
  Download,
  Filter,
} from "lucide-react"
import { useTranslation } from "@/lib/i18n"

interface Project {
  id: string
  name: string
}

export default function CommunityOutreach() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState("overview")
  const [projects, setProjects] = useState<Project[]>([])

  const originalProjects = [
    {
      id: "1",
      title: "Distribuição de Alimentos",
      description: "Programa semanal de distribuição de cestas básicas",
      status: "active",
      progress: 75,
      target: 100,
      current: 75,
      location: "Centro da Cidade",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      volunteers: 12,
      beneficiaries: 150,
      budget: 50000,
      spent: 37500,
    },
    {
      id: "2",
      title: "Aulas de Alfabetização",
      description: "Ensino básico para adultos da comunidade",
      status: "active",
      progress: 60,
      target: 50,
      current: 30,
      location: "Escola Comunitária",
      startDate: "2024-02-01",
      endDate: "2024-11-30",
      volunteers: 8,
      beneficiaries: 45,
      budget: 25000,
      spent: 15000,
    },
    {
      id: "3",
      title: "Campanha de Saúde",
      description: "Consultas médicas gratuitas e vacinação",
      status: "planning",
      progress: 25,
      target: 200,
      current: 50,
      location: "Posto de Saúde",
      startDate: "2024-03-15",
      endDate: "2024-03-17",
      volunteers: 15,
      beneficiaries: 300,
      budget: 30000,
      spent: 7500,
    },
  ]

  const volunteers = [
    {
      id: "1",
      name: "Maria Silva",
      role: "Coordenadora",
      projects: 3,
      hours: 120,
      avatar: "/placeholder.svg",
    },
    {
      id: "2",
      name: "João Santos",
      role: "Voluntário",
      projects: 2,
      hours: 80,
      avatar: "/placeholder.svg",
    },
    {
      id: "3",
      name: "Ana Costa",
      role: "Especialista",
      projects: 1,
      hours: 60,
      avatar: "/placeholder.svg",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "planning":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Ativo"
      case "planning":
        return "Planejamento"
      case "completed":
        return "Concluído"
      default:
        return "Desconhecido"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("pt-AO", {
      style: "currency",
      currency: "AOA",
    }).format(amount)
  }

  const totalStats = {
    projects: originalProjects.length,
    activeProjects: originalProjects.filter((p) => p.status === "active").length,
    totalVolunteers: volunteers.length,
    totalBeneficiaries: originalProjects.reduce((sum, p) => sum + p.beneficiaries, 0),
    totalBudget: originalProjects.reduce((sum, p) => sum + p.budget, 0),
    totalSpent: originalProjects.reduce((sum, p) => sum + p.spent, 0),
  }

  function addProject() {
    const name = prompt("Project name?")
    if (name) setProjects((p) => [...p, { id: Date.now().toString(), name }])
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t("outreach")}</h2>
          <p className="text-gray-600">Gerencie projetos de evangelismo e ação social</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Relatório
          </Button>
          <Button size="sm" onClick={addProject}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Projeto
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Projetos Ativos</p>
                <p className="text-2xl font-bold">{totalStats.activeProjects}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Voluntários</p>
                <p className="text-2xl font-bold">{totalStats.totalVolunteers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Beneficiários</p>
                <p className="text-2xl font-bold">{totalStats.totalBeneficiaries}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Orçamento Total</p>
                <p className="text-2xl font-bold">{formatCurrency(totalStats.totalBudget)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="projects">Projetos</TabsTrigger>
          <TabsTrigger value="volunteers">Voluntários</TabsTrigger>
          <TabsTrigger value="impact">Impacto</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Active Projects */}
            <Card>
              <CardHeader>
                <CardTitle>Projetos em Andamento</CardTitle>
                <CardDescription>Status dos projetos ativos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {originalProjects
                    .filter((p) => p.status === "active")
                    .map((project) => (
                      <div key={project.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{project.title}</span>
                          <Badge className={getStatusColor(project.status)}>{getStatusLabel(project.status)}</Badge>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>
                            {project.current}/{project.target} beneficiários
                          </span>
                          <span>{project.progress}% concluído</span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Volunteers */}
            <Card>
              <CardHeader>
                <CardTitle>Principais Voluntários</CardTitle>
                <CardDescription>Reconhecimento aos mais dedicados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {volunteers.map((volunteer) => (
                    <div key={volunteer.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-medium">{volunteer.name[0]}</span>
                        </div>
                        <div>
                          <p className="font-medium">{volunteer.name}</p>
                          <p className="text-sm text-gray-600">{volunteer.role}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{volunteer.hours}h</p>
                        <p className="text-sm text-gray-600">{volunteer.projects} projetos</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="projects" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {originalProjects.map((project) => (
              <Card key={project.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{project.title}</CardTitle>
                      <CardDescription>{project.description}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(project.status)}>{getStatusLabel(project.status)}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progresso</span>
                        <span>{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Beneficiários</p>
                        <p className="font-medium">{project.beneficiaries}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Voluntários</p>
                        <p className="font-medium">{project.volunteers}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Orçamento</p>
                        <p className="font-medium">{formatCurrency(project.budget)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Gasto</p>
                        <p className="font-medium">{formatCurrency(project.spent)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      {project.location}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      {new Date(project.startDate).toLocaleDateString("pt-BR")} -{" "}
                      {new Date(project.endDate).toLocaleDateString("pt-BR")}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        Ver
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-3 w-3 mr-1" />
                        Editar
                      </Button>
                      <Button size="sm" variant="outline">
                        <Share2 className="h-3 w-3 mr-1" />
                        Compartilhar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {projects.length ? (
              projects.map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded border p-2 text-sm">
                  {p.name}
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => setProjects((ps) => ps.filter((x) => x.id !== p.id))}
                  >
                    ×
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">No outreach projects yet.</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="volunteers" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestão de Voluntários</CardTitle>
              <CardDescription>Coordene e reconheça o trabalho dos voluntários</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {volunteers.map((volunteer) => (
                  <Card key={volunteer.id}>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-blue-600 font-medium text-lg">{volunteer.name[0]}</span>
                        </div>
                        <h3 className="font-medium">{volunteer.name}</h3>
                        <p className="text-sm text-gray-600 mb-3">{volunteer.role}</p>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Projetos:</span>
                            <span className="font-medium">{volunteer.projects}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Horas:</span>
                            <span className="font-medium">{volunteer.hours}h</span>
                          </div>
                        </div>
                        <Button size="sm" className="mt-3 w-full">
                          Ver Perfil
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="impact" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Impacto Social</CardTitle>
                <CardDescription>Métricas de impacto dos projetos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">{totalStats.totalBeneficiaries}</div>
                    <div className="text-sm text-green-700">Vidas Impactadas</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{totalStats.activeProjects}</div>
                      <div className="text-xs text-blue-700">Projetos Ativos</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{totalStats.totalVolunteers}</div>
                      <div className="text-xs text-purple-700">Voluntários</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Orçamento e Gastos</CardTitle>
                <CardDescription>Controle financeiro dos projetos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Orçamento Utilizado</span>
                      <span>{((totalStats.totalSpent / totalStats.totalBudget) * 100).toFixed(1)}%</span>
                    </div>
                    <Progress value={(totalStats.totalSpent / totalStats.totalBudget) * 100} />
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Total Orçado</p>
                      <p className="font-medium">{formatCurrency(totalStats.totalBudget)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Total Gasto</p>
                      <p className="font-medium">{formatCurrency(totalStats.totalSpent)}</p>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Saldo Disponível</p>
                    <p className="text-lg font-bold text-green-600">
                      {formatCurrency(totalStats.totalBudget - totalStats.totalSpent)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
