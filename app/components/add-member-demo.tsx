"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, MapPin, Heart, Briefcase, Star, CheckCircle, AlertCircle, Camera } from "lucide-react"

export function AddMemberDemo() {
  const [currentStep, setCurrentStep] = useState(0)

  const demoMember = {
    first_name: "João",
    last_name: "Silva Santos",
    email: "joao.silva@gmail.com",
    phone: "+244 923 456 789",
    gender: "Male",
    date_of_birth: "1985-03-15",
    address: "Rua da Paz, 123, Bairro Maianga, Luanda",
    member_status: "active",
    emergency_contact_name: "Maria Silva Santos",
    emergency_contact_phone: "+244 912 345 678",
    medical_conditions: "Diabetes tipo 2, alergia a amendoim",
    baptism_date: "2020-12-25",
    membership_date: "2021-01-15",
    occupation: "Professor de Matemática",
    skills: "Ensino, música (violão), liderança juvenil",
    interests: "Ministério de louvor, evangelismo, trabalho social",
    notes:
      "Membro ativo desde 2021, participa do coral da igreja e lidera o grupo de jovens aos sábados. Tem experiência em organização de eventos e é muito dedicado às atividades da comunidade.",
    profile_image: "/placeholder.svg?height=120&width=120",
  }

  const steps = [
    {
      title: "Informações Básicas",
      description: "Nome, contato e dados pessoais",
      fields: ["first_name", "last_name", "email", "phone", "gender", "date_of_birth"],
      icon: User,
    },
    {
      title: "Endereço e Status",
      description: "Localização e status na igreja",
      fields: ["address", "member_status", "membership_date"],
      icon: MapPin,
    },
    {
      title: "Contato de Emergência",
      description: "Pessoa para contatar em emergências",
      fields: ["emergency_contact_name", "emergency_contact_phone", "medical_conditions"],
      icon: Heart,
    },
    {
      title: "Informações Adicionais",
      description: "Ocupação, habilidades e interesses",
      fields: ["occupation", "skills", "interests", "baptism_date"],
      icon: Briefcase,
    },
    {
      title: "Notas e Foto",
      description: "Observações e foto do perfil",
      fields: ["notes", "profile_image"],
      icon: Camera,
    },
  ]

  const getFieldValue = (field: string) => {
    const value = demoMember[field as keyof typeof demoMember]

    // Format specific fields
    switch (field) {
      case "date_of_birth":
        return new Date(value as string).toLocaleDateString("pt-AO")
      case "baptism_date":
      case "membership_date":
        return new Date(value as string).toLocaleDateString("pt-AO")
      case "gender":
        return value === "Male" ? "Masculino" : "Feminino"
      case "member_status":
        return value === "active" ? "Ativo" : "Inativo"
      default:
        return value as string
    }
  }

  const getFieldLabel = (field: string) => {
    const labels: Record<string, string> = {
      first_name: "Nome",
      last_name: "Sobrenome",
      email: "Email",
      phone: "Telefone",
      gender: "Gênero",
      date_of_birth: "Data de Nascimento",
      address: "Endereço",
      member_status: "Status",
      membership_date: "Data de Adesão",
      emergency_contact_name: "Nome do Contato",
      emergency_contact_phone: "Telefone do Contato",
      medical_conditions: "Condições Médicas",
      occupation: "Ocupação",
      skills: "Habilidades",
      interests: "Interesses",
      baptism_date: "Data do Batismo",
      notes: "Observações",
      profile_image: "Foto do Perfil",
    }
    return labels[field] || field
  }

  const calculateAge = (birthDate: string) => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }

    return age
  }

  return (
    <div className="space-y-6">
      {/* Demo Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Demonstração: Adicionar Novo Membro
          </CardTitle>
          <CardDescription>
            Exemplo completo de como adicionar um membro com todos os campos preenchidos
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Step Navigation */}
      <div className="flex flex-wrap gap-2 justify-center">
        {steps.map((step, index) => {
          const Icon = step.icon
          return (
            <Button
              key={index}
              variant={currentStep === index ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentStep(index)}
              className={currentStep === index ? "bg-indigo-600" : ""}
            >
              <Icon className="h-4 w-4 mr-2" />
              {step.title}
            </Button>
          )
        })}
      </div>

      {/* Current Step Content */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          {/* ➋ JSX element */}
          {/* ➊ pick the current step’s icon */}
          {(() => {
            const CurrentIcon = steps[currentStep].icon
            return (
              <CardTitle className="flex items-center gap-2">
                <CurrentIcon className="h-5 w-5" />
                {steps[currentStep].title}
              </CardTitle>
            )
          })()}
          <CardDescription>{steps[currentStep].description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {steps[currentStep].fields.map((field) => (
            <div key={field} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700">{getFieldLabel(field)}</label>
                {field === "profile_image" ? (
                  <div className="mt-2">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={demoMember.profile_image || "/placeholder.svg"} alt="João Silva Santos" />
                      <AvatarFallback>JS</AvatarFallback>
                    </Avatar>
                  </div>
                ) : (
                  <p className="mt-1 text-gray-900">{getFieldValue(field)}</p>
                )}
              </div>
              <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Member Preview Card */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Pré-visualização do Membro
          </CardTitle>
          <CardDescription>Como o membro aparecerá no sistema após ser adicionado</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={demoMember.profile_image || "/placeholder.svg"} alt="João Silva Santos" />
                <AvatarFallback>JS</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {demoMember.first_name} {demoMember.last_name}
                </h3>
                <p className="text-sm text-gray-600">{demoMember.email}</p>
                <p className="text-sm text-gray-500">{demoMember.phone}</p>
                <div className="flex gap-2 mt-2">
                  <Badge variant="default" className="text-xs">
                    Ativo
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Masculino
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {calculateAge(demoMember.date_of_birth)} anos
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {demoMember.occupation}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="text-right text-sm text-gray-500">
              <p>Membro desde: {new Date(demoMember.membership_date).toLocaleDateString("pt-AO")}</p>
              <p>Batizado: {new Date(demoMember.baptism_date).toLocaleDateString("pt-AO")}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Features Highlight */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <User className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <h4 className="font-semibold text-blue-900">Perfil Completo</h4>
            <p className="text-sm text-blue-700">Todas as informações pessoais e de contato</p>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4 text-center">
            <Heart className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h4 className="font-semibold text-green-900">Segurança</h4>
            <p className="text-sm text-green-700">Contatos de emergência e condições médicas</p>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4 text-center">
            <Star className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <h4 className="font-semibold text-purple-900">Ministérios</h4>
            <p className="text-sm text-purple-700">Habilidades e áreas de interesse</p>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          variant="outline"
          disabled={currentStep === 0}
        >
          Anterior
        </Button>
        <Button
          onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
          disabled={currentStep === steps.length - 1}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          Próximo
        </Button>
        {currentStep === steps.length - 1 && (
          <Button className="bg-green-600 hover:bg-green-700">
            <CheckCircle className="h-4 w-4 mr-2" />
            Adicionar Membro
          </Button>
        )}
      </div>

      {/* Validation Notes */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-900">Validações Implementadas</h4>
              <ul className="text-sm text-yellow-800 mt-2 space-y-1">
                <li>Nome e sobrenome são obrigatórios</li>
                <li>Email deve ter formato válido</li>
                <li>Telefone deve seguir formato angolano (+244)</li>
                <li>Data de nascimento não pode ser futura</li>
                <li>Campos de texto têm limite de caracteres</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AddMemberDemo
