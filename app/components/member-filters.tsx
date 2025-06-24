"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X, Users, Calendar, MapPin } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface MemberFiltersProps {
  onFiltersChange?: (filters: any) => void
}

export default function MemberFilters({ onFiltersChange }: MemberFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [genderFilter, setGenderFilter] = useState("all")
  const [ageRangeFilter, setAgeRangeFilter] = useState("all")
  const [joinDateFilter, setJoinDateFilter] = useState("all")

  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    onFiltersChange?.({
      search: value,
      status: statusFilter,
      department: departmentFilter,
      gender: genderFilter,
      ageRange: ageRangeFilter,
      joinDate: joinDateFilter,
    })
  }

  const handleFilterChange = (filterType: string, value: string) => {
    let newActiveFilters = [...activeFilters]

    switch (filterType) {
      case "status":
        setStatusFilter(value)
        if (value !== "all" && !newActiveFilters.includes("status")) {
          newActiveFilters.push("status")
        } else if (value === "all") {
          newActiveFilters = newActiveFilters.filter((f) => f !== "status")
        }
        break
      case "department":
        setDepartmentFilter(value)
        if (value !== "all" && !newActiveFilters.includes("department")) {
          newActiveFilters.push("department")
        } else if (value === "all") {
          newActiveFilters = newActiveFilters.filter((f) => f !== "department")
        }
        break
      case "gender":
        setGenderFilter(value)
        if (value !== "all" && !newActiveFilters.includes("gender")) {
          newActiveFilters.push("gender")
        } else if (value === "all") {
          newActiveFilters = newActiveFilters.filter((f) => f !== "gender")
        }
        break
      case "ageRange":
        setAgeRangeFilter(value)
        if (value !== "all" && !newActiveFilters.includes("ageRange")) {
          newActiveFilters.push("ageRange")
        } else if (value === "all") {
          newActiveFilters = newActiveFilters.filter((f) => f !== "ageRange")
        }
        break
      case "joinDate":
        setJoinDateFilter(value)
        if (value !== "all" && !newActiveFilters.includes("joinDate")) {
          newActiveFilters.push("joinDate")
        } else if (value === "all") {
          newActiveFilters = newActiveFilters.filter((f) => f !== "joinDate")
        }
        break
    }

    setActiveFilters(newActiveFilters)

    onFiltersChange?.({
      search: searchTerm,
      status: filterType === "status" ? value : statusFilter,
      department: filterType === "department" ? value : departmentFilter,
      gender: filterType === "gender" ? value : genderFilter,
      ageRange: filterType === "ageRange" ? value : ageRangeFilter,
      joinDate: filterType === "joinDate" ? value : joinDateFilter,
    })
  }

  const clearAllFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setDepartmentFilter("all")
    setGenderFilter("all")
    setAgeRangeFilter("all")
    setJoinDateFilter("all")
    setActiveFilters([])

    onFiltersChange?.({
      search: "",
      status: "all",
      department: "all",
      gender: "all",
      ageRange: "all",
      joinDate: "all",
    })
  }

  const clearFilter = (filterType: string) => {
    handleFilterChange(filterType, "all")
  }

  const getFilterLabel = (filterType: string) => {
    switch (filterType) {
      case "status":
        return `Status: ${statusFilter === "all" ? "Todos os status" : statusFilter}`
      case "department":
        return `Departamento: ${departmentFilter === "all" ? "Todos os departamentos" : departmentFilter}`
      case "gender":
        return `Gênero: ${genderFilter === "all" ? "Todos os gêneros" : genderFilter}`
      case "ageRange":
        return `Idade: ${ageRangeFilter === "all" ? "Todas as idades" : ageRangeFilter}`
      case "joinDate":
        return `Membro desde: ${joinDateFilter === "all" ? "Qualquer período" : joinDateFilter}`
      default:
        return filterType
    }
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar membros por nome, email ou telefone..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Advanced Filters */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filtros
              {activeFilters.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFilters.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <Card className="border-0 shadow-none">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center justify-between">
                  Filtros Avançados
                  {activeFilters.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-xs">
                      Limpar Todos
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Status Filter */}
                <div className="space-y-2">
                  <Label htmlFor="status-filter">Status</Label>
                  <Select value={statusFilter} onValueChange={(value) => handleFilterChange("status", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os status</SelectItem>
                      <SelectItem value="active">Ativo</SelectItem>
                      <SelectItem value="inactive">Inativo</SelectItem>
                      <SelectItem value="pending">Pendente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Department Filter */}
                <div className="space-y-2">
                  <Label htmlFor="department-filter">Departamento</Label>
                  <Select value={departmentFilter} onValueChange={(value) => handleFilterChange("department", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os departamentos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os departamentos</SelectItem>
                      <SelectItem value="worship">Ministério de Louvor</SelectItem>
                      <SelectItem value="children">Ministério Infantil</SelectItem>
                      <SelectItem value="youth">Ministério Jovem</SelectItem>
                      <SelectItem value="evangelism">Evangelismo</SelectItem>
                      <SelectItem value="administration">Administração</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Gender Filter */}
                <div className="space-y-2">
                  <Label htmlFor="gender-filter">Gênero</Label>
                  <Select value={genderFilter} onValueChange={(value) => handleFilterChange("gender", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os gêneros" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os gêneros</SelectItem>
                      <SelectItem value="male">Masculino</SelectItem>
                      <SelectItem value="female">Feminino</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Age Range Filter */}
                <div className="space-y-2">
                  <Label htmlFor="age-filter">Faixa Etária</Label>
                  <Select value={ageRangeFilter} onValueChange={(value) => handleFilterChange("ageRange", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas as idades" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as idades</SelectItem>
                      <SelectItem value="0-17">0-17 anos</SelectItem>
                      <SelectItem value="18-30">18-30 anos</SelectItem>
                      <SelectItem value="31-50">31-50 anos</SelectItem>
                      <SelectItem value="51-70">51-70 anos</SelectItem>
                      <SelectItem value="70+">70+ anos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Join Date Filter */}
                <div className="space-y-2">
                  <Label htmlFor="join-date-filter">Membro Desde</Label>
                  <Select value={joinDateFilter} onValueChange={(value) => handleFilterChange("joinDate", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Qualquer período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Qualquer período</SelectItem>
                      <SelectItem value="last-month">Último mês</SelectItem>
                      <SelectItem value="last-3-months">Últimos 3 meses</SelectItem>
                      <SelectItem value="last-6-months">Últimos 6 meses</SelectItem>
                      <SelectItem value="last-year">Último ano</SelectItem>
                      <SelectItem value="more-than-year">Mais de 1 ano</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </PopoverContent>
        </Popover>
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-600 flex items-center">Filtros ativos:</span>
          {activeFilters.map((filter) => (
            <Badge key={filter} variant="secondary" className="flex items-center gap-1">
              {getFilterLabel(filter)}
              <Button variant="ghost" size="sm" className="h-auto p-0 ml-1" onClick={() => clearFilter(filter)}>
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Filtrado</p>
                <p className="text-xl font-bold">247</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Novos (30 dias)</p>
                <p className="text-xl font-bold">12</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Departamentos</p>
                <p className="text-xl font-bold">8</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
