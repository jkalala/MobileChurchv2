"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, Star, Award, Calendar, BookOpen, Heart, Zap, Crown, Medal, Gift } from "lucide-react"

export default function GamificationHub() {
  const [activeTab, setActiveTab] = useState("overview")

  const userStats = {
    level: 12,
    xp: 2450,
    xpToNext: 3000,
    totalPoints: 15680,
    rank: 3,
    badges: 8,
    streaks: {
      attendance: 12,
      reading: 7,
      service: 4,
    },
  }

  const achievements = [
    {
      id: 1,
      title: "Fiel Adorador",
      description: "Participou de 10 cultos consecutivos",
      icon: Trophy,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      progress: 100,
      unlocked: true,
      xp: 500,
    },
    {
      id: 2,
      title: "Estudioso da Palavra",
      description: "Leu a Bíblia por 30 dias seguidos",
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      progress: 87,
      unlocked: false,
      xp: 750,
    },
    {
      id: 3,
      title: "Coração Generoso",
      description: "Participou de 5 projetos sociais",
      icon: Heart,
      color: "text-red-600",
      bgColor: "bg-red-100",
      progress: 60,
      unlocked: false,
      xp: 600,
    },
    {
      id: 4,
      title: "Líder Servidor",
      description: "Liderou uma atividade ministerial",
      icon: Crown,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      progress: 100,
      unlocked: true,
      xp: 1000,
    },
  ]

  const leaderboard = [
    {
      id: 1,
      name: "Maria Silva",
      points: 18500,
      level: 15,
      avatar: "/placeholder.svg",
      badges: 12,
      rank: 1,
    },
    {
      id: 2,
      name: "João Santos",
      points: 16200,
      level: 13,
      avatar: "/placeholder.svg",
      badges: 10,
      rank: 2,
    },
    {
      id: 3,
      name: "Ana Costa",
      points: 15680,
      level: 12,
      avatar: "/placeholder.svg",
      badges: 8,
      rank: 3,
    },
    {
      id: 4,
      name: "Pedro Lima",
      points: 14300,
      level: 11,
      avatar: "/placeholder.svg",
      badges: 7,
      rank: 4,
    },
    {
      id: 5,
      name: "Lucia Ferreira",
      points: 13800,
      level: 11,
      avatar: "/placeholder.svg",
      badges: 6,
      rank: 5,
    },
  ]

  const challenges = [
    {
      id: 1,
      title: "Semana de Oração",
      description: "Participe de todas as reuniões de oração desta semana",
      type: "weekly",
      progress: 3,
      target: 5,
      xp: 300,
      deadline: "2024-02-04",
      active: true,
    },
    {
      id: 2,
      title: "Evangelismo Pessoal",
      description: "Compartilhe o evangelho com 3 pessoas",
      type: "monthly",
      progress: 1,
      target: 3,
      xp: 500,
      deadline: "2024-02-29",
      active: true,
    },
    {
      id: 3,
      title: "Leitura Bíblica",
      description: "Leia 1 capítulo da Bíblia por dia durante 21 dias",
      type: "habit",
      progress: 14,
      target: 21,
      xp: 400,
      deadline: "2024-02-15",
      active: true,
    },
  ]

  const rewards = [
    {
      id: 1,
      title: "Café com o Pastor",
      description: "Uma conversa especial com a liderança",
      cost: 5000,
      type: "experience",
      icon: Gift,
      available: true,
    },
    {
      id: 2,
      title: "Livro Cristão",
      description: "Escolha um livro da biblioteca da igreja",
      cost: 3000,
      type: "physical",
      icon: BookOpen,
      available: true,
    },
    {
      id: 3,
      title: "Certificado de Reconhecimento",
      description: "Certificado oficial de dedicação ministerial",
      cost: 8000,
      type: "recognition",
      icon: Award,
      available: false,
    },
  ]

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />
      default:
        return <Star className="h-5 w-5 text-gray-400" />
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500"
    if (progress >= 50) return "bg-yellow-500"
    return "bg-blue-500"
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Centro de Gamificação</h2>
          <p className="text-gray-600">Acompanhe seu crescimento espiritual e conquiste recompensas</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{userStats.level}</p>
            <p className="text-xs text-gray-600">Nível</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{userStats.totalPoints.toLocaleString()}</p>
            <p className="text-xs text-gray-600">Pontos</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">#{userStats.rank}</p>
            <p className="text-xs text-gray-600">Ranking</p>
          </div>
        </div>
      </div>

      {/* Progress Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Progresso Atual
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Nível {userStats.level}</span>
                <span>
                  {userStats.xp}/{userStats.xpToNext} XP
                </span>
              </div>
              <Progress value={(userStats.xp / userStats.xpToNext) * 100} className="h-3" />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <Calendar className="h-6 w-6 mx-auto mb-1 text-blue-600" />
                <p className="text-lg font-bold text-blue-600">{userStats.streaks.attendance}</p>
                <p className="text-xs text-blue-700">Dias Consecutivos</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <BookOpen className="h-6 w-6 mx-auto mb-1 text-green-600" />
                <p className="text-lg font-bold text-green-600">{userStats.streaks.reading}</p>
                <p className="text-xs text-green-700">Leitura Bíblica</p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <Heart className="h-6 w-6 mx-auto mb-1 text-purple-600" />
                <p className="text-lg font-bold text-purple-600">{userStats.streaks.service}</p>
                <p className="text-xs text-purple-700">Serviço Voluntário</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="achievements">Conquistas</TabsTrigger>
          <TabsTrigger value="challenges">Desafios</TabsTrigger>
          <TabsTrigger value="leaderboard">Ranking</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Achievements */}
            <Card>
              <CardHeader>
                <CardTitle>Conquistas Recentes</CardTitle>
                <CardDescription>Suas últimas realizações</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {achievements
                    .filter((a) => a.unlocked)
                    .map((achievement) => {
                      const IconComponent = achievement.icon
                      return (
                        <div key={achievement.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className={`p-2 rounded-full ${achievement.bgColor}`}>
                            <IconComponent className={`h-5 w-5 ${achievement.color}`} />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{achievement.title}</p>
                            <p className="text-sm text-gray-600">{achievement.description}</p>
                          </div>
                          <Badge variant="secondary">+{achievement.xp} XP</Badge>
                        </div>
                      )
                    })}
                </div>
              </CardContent>
            </Card>

            {/* Active Challenges */}
            <Card>
              <CardHeader>
                <CardTitle>Desafios Ativos</CardTitle>
                <CardDescription>Complete para ganhar XP</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {challenges
                    .filter((c) => c.active)
                    .map((challenge) => (
                      <div key={challenge.id} className="space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{challenge.title}</p>
                            <p className="text-sm text-gray-600">{challenge.description}</p>
                          </div>
                          <Badge variant="outline">+{challenge.xp} XP</Badge>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>
                              {challenge.progress}/{challenge.target}
                            </span>
                            <span>{Math.round((challenge.progress / challenge.target) * 100)}%</span>
                          </div>
                          <Progress value={(challenge.progress / challenge.target) * 100} />
                        </div>
                        <p className="text-xs text-gray-500">
                          Prazo: {new Date(challenge.deadline).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => {
              const IconComponent = achievement.icon
              return (
                <Card key={achievement.id} className={achievement.unlocked ? "border-green-200" : "opacity-75"}>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div
                        className={`w-16 h-16 rounded-full ${achievement.bgColor} flex items-center justify-center mx-auto mb-3`}
                      >
                        <IconComponent className={`h-8 w-8 ${achievement.color}`} />
                      </div>
                      <h3 className="font-medium mb-1">{achievement.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>

                      {achievement.unlocked ? (
                        <Badge className="bg-green-100 text-green-800">
                          <Trophy className="h-3 w-3 mr-1" />
                          Conquistado
                        </Badge>
                      ) : (
                        <div className="space-y-2">
                          <Progress value={achievement.progress} />
                          <p className="text-xs text-gray-500">{achievement.progress}% completo</p>
                        </div>
                      )}

                      <p className="text-xs text-blue-600 mt-2">+{achievement.xp} XP</p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="challenges" className="mt-6">
          <div className="space-y-4">
            {challenges.map((challenge) => (
              <Card key={challenge.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-medium">{challenge.title}</h3>
                      <p className="text-sm text-gray-600">{challenge.description}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">+{challenge.xp} XP</Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(challenge.deadline).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>
                        Progresso: {challenge.progress}/{challenge.target}
                      </span>
                      <span>{Math.round((challenge.progress / challenge.target) * 100)}%</span>
                    </div>
                    <Progress value={(challenge.progress / challenge.target) * 100} />
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <Badge variant="secondary" className="capitalize">
                      {challenge.type}
                    </Badge>
                    <Button size="sm" variant="outline">
                      Ver Detalhes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Ranking da Igreja
              </CardTitle>
              <CardDescription>Os membros mais dedicados este mês</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboard.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {getRankIcon(member.rank)}
                        <span className="font-bold text-lg">#{member.rank}</span>
                      </div>
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={member.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{member.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-gray-600">Nível {member.level}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{member.points.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">{member.badges} conquistas</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
