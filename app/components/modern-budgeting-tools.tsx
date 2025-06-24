"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Target,
  PieChartIcon as RechartsPieChart,
  BarChart3,
  Calendar,
  Plus,
  Edit,
  Download,
  Bell,
  Zap,
  Calculator,
  Wallet,
  CreditCard,
  Building,
  Users,
  Music,
  Heart,
  BookOpen,
  Baby,
} from "lucide-react"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts"
import { DatabaseService } from "@/lib/database"
import { toast } from "sonner"

interface Budget {
  id: string
  name: string
  description?: string
  total_amount: number
  period: "monthly" | "quarterly" | "yearly"
  start_date: string
  end_date: string
  status: "draft" | "active" | "completed" | "paused"
  categories: BudgetCategory[]
  created_at: string
}

interface BudgetCategory {
  id: string
  budget_id: string
  name: string
  allocated_amount: number
  spent_amount: number
  ministry_id?: string
  color: string
  icon: string
}

interface Expense {
  id: string
  budget_id: string
  category_id: string
  amount: number
  description: string
  date: string
  payment_method: string
  receipt_url?: string
  approved_by?: string
  status: "pending" | "approved" | "rejected"
}

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#00ff00", "#ff00ff", "#00ffff", "#ff0000"]

const MINISTRY_ICONS = {
  worship: Music,
  youth: Users,
  children: Baby,
  outreach: Heart,
  education: BookOpen,
  administration: Building,
  maintenance: Building,
  events: Calendar,
}

export default function ModernBudgetingTools() {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null)
  const [loading, setLoading] = useState(true)
  const [showCreateBudget, setShowCreateBudget] = useState(false)
  const [showAddExpense, setShowAddExpense] = useState(false)

  // Form states
  const [budgetForm, setBudgetForm] = useState({
    name: "",
    description: "",
    total_amount: "",
    period: "monthly" as const,
    start_date: "",
    end_date: "",
  })

  const [expenseForm, setExpenseForm] = useState({
    category_id: "",
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    payment_method: "cash",
  })

  useEffect(() => {
    loadBudgetData()
  }, [])

  const loadBudgetData = async () => {
    try {
      setLoading(true)
      // In a real app, these would be separate API calls
      const [budgetData, expenseData] = await Promise.all([DatabaseService.getBudgets(), DatabaseService.getExpenses()])

      setBudgets(budgetData)
      setExpenses(expenseData)

      if (budgetData.length > 0 && !selectedBudget) {
        setSelectedBudget(budgetData[0])
      }
    } catch (error) {
      console.error("Error loading budget data:", error)
      toast.error("Erro ao carregar dados do orçamento")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateBudget = async () => {
    try {
      const newBudget = await DatabaseService.createBudget({
        ...budgetForm,
        total_amount: Number.parseFloat(budgetForm.total_amount),
        status: "draft",
      })

      setBudgets([newBudget, ...budgets])
      setShowCreateBudget(false)
      setBudgetForm({
        name: "",
        description: "",
        total_amount: "",
        period: "monthly",
        start_date: "",
        end_date: "",
      })
      toast.success("Orçamento criado com sucesso!")
    } catch (error) {
      console.error("Error creating budget:", error)
      toast.error("Erro ao criar orçamento")
    }
  }

  const handleAddExpense = async () => {
    try {
      if (!selectedBudget) return

      const newExpense = await DatabaseService.createExpense({
        ...expenseForm,
        budget_id: selectedBudget.id,
        amount: Number.parseFloat(expenseForm.amount),
        status: "pending",
      })

      setExpenses([newExpense, ...expenses])
      setShowAddExpense(false)
      setExpenseForm({
        category_id: "",
        amount: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
        payment_method: "cash",
      })
      toast.success("Despesa adicionada com sucesso!")
      loadBudgetData() // Refresh to update spent amounts
    } catch (error) {
      console.error("Error adding expense:", error)
      toast.error("Erro ao adicionar despesa")
    }
  }

  // Calculate budget analytics
  const calculateBudgetAnalytics = (budget: Budget) => {
    const totalAllocated = budget.categories.reduce((sum, cat) => sum + cat.allocated_amount, 0)
    const totalSpent = budget.categories.reduce((sum, cat) => sum + cat.spent_amount, 0)
    const remaining = totalAllocated - totalSpent
    const utilizationRate = totalAllocated > 0 ? (totalSpent / totalAllocated) * 100 : 0

    return {
      totalAllocated,
      totalSpent,
      remaining,
      utilizationRate,
      isOverBudget: totalSpent > totalAllocated,
    }
  }

  // Generate forecast data
  const generateForecastData = (budget: Budget) => {
    const analytics = calculateBudgetAnalytics(budget)
    const monthsInPeriod = budget.period === "monthly" ? 1 : budget.period === "quarterly" ? 3 : 12
    const monthlySpendRate = analytics.totalSpent / monthsInPeriod

    const forecastData = []
    for (let i = 0; i < 6; i++) {
      const projectedSpent = analytics.totalSpent + monthlySpendRate * i
      forecastData.push({
        month: `Mês ${i + 1}`,
        actual: i === 0 ? analytics.totalSpent : null,
        projected: projectedSpent,
        budget: analytics.totalAllocated,
      })
    }

    return forecastData
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando ferramentas de orçamento...</p>
        </div>
      </div>
    )
  }

  const currentBudgetAnalytics = selectedBudget ? calculateBudgetAnalytics(selectedBudget) : null
  const forecastData = selectedBudget ? generateForecastData(selectedBudget) : []

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Ferramentas de Orçamento Modernas</h2>
          <p className="text-gray-600">Gerencie orçamentos com análises inteligentes e previsões</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showCreateBudget} onOpenChange={setShowCreateBudget}>
            <DialogTrigger asChild>
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                <Plus className="h-4 w-4 mr-2" />
                Novo Orçamento
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Criar Novo Orçamento</DialogTitle>
                <DialogDescription>Configure um novo orçamento para sua igreja</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="budget-name">Nome do Orçamento</Label>
                  <Input
                    id="budget-name"
                    value={budgetForm.name}
                    onChange={(e) => setBudgetForm({ ...budgetForm, name: e.target.value })}
                    placeholder="Ex: Orçamento 2024"
                  />
                </div>
                <div>
                  <Label htmlFor="budget-description">Descrição</Label>
                  <Textarea
                    id="budget-description"
                    value={budgetForm.description}
                    onChange={(e) => setBudgetForm({ ...budgetForm, description: e.target.value })}
                    placeholder="Descrição opcional..."
                  />
                </div>
                <div>
                  <Label htmlFor="budget-amount">Valor Total (Kz)</Label>
                  <Input
                    id="budget-amount"
                    type="number"
                    value={budgetForm.total_amount}
                    onChange={(e) => setBudgetForm({ ...budgetForm, total_amount: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="budget-period">Período</Label>
                  <Select
                    value={budgetForm.period}
                    onValueChange={(value: any) => setBudgetForm({ ...budgetForm, period: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Mensal</SelectItem>
                      <SelectItem value="quarterly">Trimestral</SelectItem>
                      <SelectItem value="yearly">Anual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start-date">Data Início</Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={budgetForm.start_date}
                      onChange={(e) => setBudgetForm({ ...budgetForm, start_date: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="end-date">Data Fim</Label>
                    <Input
                      id="end-date"
                      type="date"
                      value={budgetForm.end_date}
                      onChange={(e) => setBudgetForm({ ...budgetForm, end_date: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleCreateBudget} className="flex-1">
                    Criar Orçamento
                  </Button>
                  <Button variant="outline" onClick={() => setShowCreateBudget(false)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Budget Selector */}
      {budgets.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Label>Orçamento Ativo:</Label>
              <Select
                value={selectedBudget?.id}
                onValueChange={(value) => {
                  const budget = budgets.find((b) => b.id === value)
                  setSelectedBudget(budget || null)
                }}
              >
                <SelectTrigger className="w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {budgets.map((budget) => (
                    <SelectItem key={budget.id} value={budget.id}>
                      {budget.name} ({budget.period})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedBudget && currentBudgetAnalytics && (
        <>
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-100 border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-700">Orçamento Total</p>
                    <p className="text-2xl font-bold text-blue-900">
                      Kz {currentBudgetAnalytics.totalAllocated.toLocaleString()}
                    </p>
                  </div>
                  <Wallet className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-700">Gasto</p>
                    <p className="text-2xl font-bold text-green-900">
                      Kz {currentBudgetAnalytics.totalSpent.toLocaleString()}
                    </p>
                    <p className="text-sm text-green-600">
                      {currentBudgetAnalytics.utilizationRate.toFixed(1)}% utilizado
                    </p>
                  </div>
                  <CreditCard className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card
              className={`bg-gradient-to-br ${currentBudgetAnalytics.isOverBudget ? "from-red-50 to-pink-100" : "from-purple-50 to-violet-100"} border-0 shadow-lg`}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className={`text-sm font-medium ${currentBudgetAnalytics.isOverBudget ? "text-red-700" : "text-purple-700"}`}
                    >
                      {currentBudgetAnalytics.isOverBudget ? "Excesso" : "Restante"}
                    </p>
                    <p
                      className={`text-2xl font-bold ${currentBudgetAnalytics.isOverBudget ? "text-red-900" : "text-purple-900"}`}
                    >
                      Kz {Math.abs(currentBudgetAnalytics.remaining).toLocaleString()}
                    </p>
                  </div>
                  {currentBudgetAnalytics.isOverBudget ? (
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                  ) : (
                    <Target className="h-8 w-8 text-purple-600" />
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-amber-100 border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-700">Categorias</p>
                    <p className="text-2xl font-bold text-orange-900">{selectedBudget.categories.length}</p>
                    <p className="text-sm text-orange-600">ministérios ativos</p>
                  </div>
                  <RechartsPieChart className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="bg-white/80 backdrop-blur-sm">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="categories">Categorias</TabsTrigger>
              <TabsTrigger value="forecast">Previsões</TabsTrigger>
              <TabsTrigger value="expenses">Despesas</TabsTrigger>
              <TabsTrigger value="insights">Insights IA</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Budget Utilization Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Utilização do Orçamento</CardTitle>
                    <CardDescription>Comparação entre orçado e gasto por categoria</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        allocated: { label: "Orçado", color: "#8884d8" },
                        spent: { label: "Gasto", color: "#82ca9d" },
                      }}
                      className="h-80"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={selectedBudget.categories}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Legend />
                          <Bar dataKey="allocated_amount" fill="#8884d8" name="Orçado" />
                          <Bar dataKey="spent_amount" fill="#82ca9d" name="Gasto" />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                {/* Budget Distribution Pie Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Distribuição do Orçamento</CardTitle>
                    <CardDescription>Alocação por ministério</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedBudget.categories.map((category) => {
                        const utilizationPercent =
                          category.allocated_amount > 0 ? (category.spent_amount / category.allocated_amount) * 100 : 0
                        const isOverBudget = category.spent_amount > category.allocated_amount
                        const IconComponent = MINISTRY_ICONS[category.icon as keyof typeof MINISTRY_ICONS] || Building

                        return (
                          <div key={category.id} className="p-4 border rounded-lg space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-gray-100">
                                  <IconComponent className="h-5 w-5" />
                                </div>
                                <div>
                                  <h3 className="font-medium">{category.name}</h3>
                                  <p className="text-sm text-gray-600">
                                    Kz {category.spent_amount.toLocaleString()} / Kz{" "}
                                    {category.allocated_amount.toLocaleString()}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <Badge
                                  variant={
                                    isOverBudget ? "destructive" : utilizationPercent > 80 ? "secondary" : "default"
                                  }
                                >
                                  {utilizationPercent.toFixed(1)}%
                                </Badge>
                                {isOverBudget && <AlertTriangle className="h-4 w-4 text-red-500 mt-1" />}
                              </div>
                            </div>
                            <Progress
                              value={Math.min(utilizationPercent, 100)}
                              className={`h-2 ${isOverBudget ? "bg-red-100" : "bg-gray-100"}`}
                            />
                            <div className="flex justify-between text-sm text-gray-600">
                              <span>
                                Restante: Kz{" "}
                                {Math.max(0, category.allocated_amount - category.spent_amount).toLocaleString()}
                              </span>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="categories">
              <Card>
                <CardHeader>
                  <CardTitle>Categorias do Orçamento</CardTitle>
                  <CardDescription>Gerencie a alocação por ministério</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedBudget.categories.map((category) => {
                      const utilizationPercent =
                        category.allocated_amount > 0 ? (category.spent_amount / category.allocated_amount) * 100 : 0
                      const isOverBudget = category.spent_amount > category.allocated_amount
                      const IconComponent = MINISTRY_ICONS[category.icon as keyof typeof MINISTRY_ICONS] || Building

                      return (
                        <div key={category.id} className="p-4 border rounded-lg space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-gray-100">
                                <IconComponent className="h-5 w-5" />
                              </div>
                              <div>
                                <h3 className="font-medium">{category.name}</h3>
                                <p className="text-sm text-gray-600">
                                  Kz {category.spent_amount.toLocaleString()} / Kz{" "}
                                  {category.allocated_amount.toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge
                                variant={
                                  isOverBudget ? "destructive" : utilizationPercent > 80 ? "secondary" : "default"
                                }
                              >
                                {utilizationPercent.toFixed(1)}%
                              </Badge>
                              {isOverBudget && <AlertTriangle className="h-4 w-4 text-red-500 mt-1" />}
                            </div>
                          </div>
                          <Progress
                            value={Math.min(utilizationPercent, 100)}
                            className={`h-2 ${isOverBudget ? "bg-red-100" : "bg-gray-100"}`}
                          />
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>
                              Restante: Kz{" "}
                              {Math.max(0, category.allocated_amount - category.spent_amount).toLocaleString()}
                            </span>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="forecast">
              <Card>
                <CardHeader>
                  <CardTitle>Previsões Financeiras</CardTitle>
                  <CardDescription>Projeções baseadas em gastos históricos</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      actual: { label: "Real", color: "#8884d8" },
                      projected: { label: "Projetado", color: "#82ca9d" },
                      budget: { label: "Orçamento", color: "#ffc658" },
                    }}
                    className="h-80"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={forecastData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Line type="monotone" dataKey="actual" stroke="#8884d8" strokeWidth={3} name="Real" />
                        <Line
                          type="monotone"
                          dataKey="projected"
                          stroke="#82ca9d"
                          strokeDasharray="5 5"
                          name="Projetado"
                        />
                        <Line type="monotone" dataKey="budget" stroke="#ffc658" strokeWidth={2} name="Orçamento" />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="expenses">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Despesas Recentes</h3>
                  <Dialog open={showAddExpense} onOpenChange={setShowAddExpense}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Nova Despesa
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Adicionar Despesa</DialogTitle>
                        <DialogDescription>Registre uma nova despesa no orçamento</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="expense-category">Categoria</Label>
                          <Select
                            value={expenseForm.category_id}
                            onValueChange={(value) => setExpenseForm({ ...expenseForm, category_id: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma categoria" />
                            </SelectTrigger>
                            <SelectContent>
                              {selectedBudget.categories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="expense-amount">Valor (Kz)</Label>
                          <Input
                            id="expense-amount"
                            type="number"
                            value={expenseForm.amount}
                            onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                            placeholder="0.00"
                          />
                        </div>
                        <div>
                          <Label htmlFor="expense-description">Descrição</Label>
                          <Textarea
                            id="expense-description"
                            value={expenseForm.description}
                            onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                            placeholder="Descrição da despesa..."
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expense-date">Data</Label>
                            <Input
                              id="expense-date"
                              type="date"
                              value={expenseForm.date}
                              onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="payment-method">Método de Pagamento</Label>
                            <Select
                              value={expenseForm.payment_method}
                              onValueChange={(value) => setExpenseForm({ ...expenseForm, payment_method: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="cash">Dinheiro</SelectItem>
                                <SelectItem value="bank_transfer">Transferência</SelectItem>
                                <SelectItem value="mpesa">M-Pesa</SelectItem>
                                <SelectItem value="card">Cartão</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="flex gap-2 pt-4">
                          <Button onClick={handleAddExpense} className="flex-1">
                            Adicionar Despesa
                          </Button>
                          <Button variant="outline" onClick={() => setShowAddExpense(false)}>
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <Card>
                  <CardContent className="p-0">
                    <div className="space-y-0">
                      {expenses.slice(0, 10).map((expense) => (
                        <div
                          key={expense.id}
                          className="p-4 border-b last:border-b-0 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-gray-100">
                              <DollarSign className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="font-medium">{expense.description}</p>
                              <p className="text-sm text-gray-600">{expense.date}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">Kz {expense.amount.toLocaleString()}</p>
                            <Badge
                              variant={
                                expense.status === "approved"
                                  ? "default"
                                  : expense.status === "pending"
                                    ? "secondary"
                                    : "destructive"
                              }
                            >
                              {expense.status === "approved"
                                ? "Aprovado"
                                : expense.status === "pending"
                                  ? "Pendente"
                                  : "Rejeitado"}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="insights">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      Insights Inteligentes
                    </CardTitle>
                    <CardDescription>Análises automáticas do seu orçamento</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {currentBudgetAnalytics.isOverBudget && (
                        <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
                          <div className="flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                            <div>
                              <h3 className="font-medium text-red-900">Orçamento Excedido</h3>
                              <p className="text-sm text-red-700 mt-1">
                                Você excedeu o orçamento em Kz{" "}
                                {Math.abs(currentBudgetAnalytics.remaining).toLocaleString()}. Considere revisar as
                                despesas ou ajustar o orçamento.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {currentBudgetAnalytics.utilizationRate > 80 && !currentBudgetAnalytics.isOverBudget && (
                        <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
                          <div className="flex items-start gap-3">
                            <Bell className="h-5 w-5 text-yellow-500 mt-0.5" />
                            <div>
                              <h3 className="font-medium text-yellow-900">Atenção: Alto Uso do Orçamento</h3>
                              <p className="text-sm text-yellow-700 mt-1">
                                Você já utilizou {currentBudgetAnalytics.utilizationRate.toFixed(1)}% do orçamento.
                                Monitore os gastos para evitar exceder o limite.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
                        <div className="flex items-start gap-3">
                          <Calculator className="h-5 w-5 text-blue-500 mt-0.5" />
                          <div>
                            <h3 className="font-medium text-blue-900">Projeção de Gastos</h3>
                            <p className="text-sm text-blue-700 mt-1">
                              Com base no padrão atual, você deve gastar aproximadamente Kz{" "}
                              {(currentBudgetAnalytics.totalSpent * 1.2).toLocaleString()} até o final do período.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-green-50 border-l-4 border-green-400 rounded-r-lg">
                        <div className="flex items-start gap-3">
                          <TrendingUp className="h-5 w-5 text-green-500 mt-0.5" />
                          <div>
                            <h3 className="font-medium text-green-900">Oportunidade de Economia</h3>
                            <p className="text-sm text-green-700 mt-1">
                              Considere renegociar contratos de fornecedores para economizar até 15% nas categorias de
                              maior gasto.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recomendações</CardTitle>
                    <CardDescription>Sugestões para otimizar seu orçamento</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="p-1 rounded-full bg-indigo-100">
                          <Target className="h-4 w-4 text-indigo-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Defina Metas Mensais</h4>
                          <p className="text-sm text-gray-600">
                            Estabeleça limites mensais para cada categoria para melhor controle.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="p-1 rounded-full bg-green-100">
                          <Bell className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Configure Alertas</h4>
                          <p className="text-sm text-gray-600">
                            Receba notificações quando atingir 80% do orçamento de cada categoria.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="p-1 rounded-full bg-purple-100">
                          <BarChart3 className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Análise Histórica</h4>
                          <p className="text-sm text-gray-600">
                            Compare com períodos anteriores para identificar tendências.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="p-1 rounded-full bg-orange-100">
                          <Users className="h-4 w-4 text-orange-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Envolvimento da Equipe</h4>
                          <p className="text-sm text-gray-600">
                            Permita que líderes de ministério acompanhem seus próprios orçamentos.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}

      {budgets.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum Orçamento Encontrado</h3>
            <p className="text-gray-600 mb-4">
              Comece criando seu primeiro orçamento para gerenciar as finanças da igreja.
            </p>
            <Button onClick={() => setShowCreateBudget(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeiro Orçamento
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
