"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Brain,
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  Heart,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Zap,
  BarChart3,
  Info,
  Download,
} from "lucide-react"
import { AIAssistant, type AIInsight } from "@/lib/ai-assistant"
import { useTranslation } from "@/lib/i18n"
import { useAuth } from "@/components/auth-provider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"

export default function AIInsightsDashboard() {
  const [insights, setInsights] = useState<AIInsight[]>([])
  const [predictions, setPredictions] = useState<any>(null)
  const [recommendations, setRecommendations] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { language, userProfile } = useAuth()
  const { t } = useTranslation(language)
  const [showHelpBanner, setShowHelpBanner] = useState(true)
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split("T")[0],
    to: new Date().toISOString().split("T")[0],
  })

  useEffect(() => {
    loadAIData()
  }, [])

  const loadAIData = async () => {
    try {
      setLoading(true)
      const [insightsData, predictionsData, recommendationsData] = await Promise.all([
        AIAssistant.generateInsights(),
        AIAssistant.generatePredictions(),
        AIAssistant.getRecommendations(userProfile?.role || "pastor"),
      ])

      setInsights(insightsData)
      setPredictions(predictionsData)
      setRecommendations(recommendationsData)
    } catch (error) {
      console.error("Error loading AI data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500"
      case "high":
        return "bg-orange-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <AlertTriangle className="h-4 w-4" />
      case "high":
        return <AlertTriangle className="h-4 w-4" />
      case "medium":
        return <Clock className="h-4 w-4" />
      case "low":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <CheckCircle className="h-4 w-4" />
    }
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "member_care":
        return <Heart className="h-5 w-5 text-pink-500" />
      case "attendance":
        return <Users className="h-5 w-5 text-blue-500" />
      case "financial":
        return <DollarSign className="h-5 w-5 text-green-500" />
      case "events":
        return <Calendar className="h-5 w-5 text-purple-500" />
      case "growth":
        return <TrendingUp className="h-5 w-5 text-orange-500" />
      case "outreach":
        return <Target className="h-5 w-5 text-cyan-500" />
      default:
        return <Brain className="h-5 w-5 text-gray-500" />
    }
  }

  // Export insights as CSV
  const handleExportInsights = () => {
    if (!insights.length) return
    const csvRows = [
      ["Title", "Description", "Priority", "Recommended Actions"],
      ...insights.map((i) => [
        i.title,
        i.description,
        i.priority,
        i.actionItems.join("; "),
      ]),
    ]
    const csvContent = csvRows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `insights-${dateRange.from}-to-${dateRange.to}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">AI is analyzing your church data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Onboarding/Help Banner */}
      {showHelpBanner && (
        <Card className="bg-blue-50 border-blue-200 mb-4">
          <CardContent className="flex items-center gap-4 py-4">
            <Info className="h-6 w-6 text-blue-500" />
            <div className="flex-1">
              <div className="font-semibold text-blue-700">Welcome to the AI Insights Dashboard!</div>
              <div className="text-sm text-blue-700">
                Get intelligent analysis, predictions, and recommendations for your church. Use the filters to adjust the date range. Hover over tabs and icons for more info. Export insights for reporting.
              </div>
            </div>
            <Button size="sm" variant="ghost" onClick={() => setShowHelpBanner(false)}>
              Dismiss
            </Button>
          </CardContent>
        </Card>
      )}
      {/* Date Range Filter and Export */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
        <div className="flex gap-2 items-center">
          <label className="text-sm font-medium">Date Range:</label>
          <Input
            type="date"
            value={dateRange.from}
            onChange={(e) => setDateRange((prev) => ({ ...prev, from: e.target.value }))}
            max={dateRange.to}
          />
          <span className="mx-1">to</span>
          <Input
            type="date"
            value={dateRange.to}
            onChange={(e) => setDateRange((prev) => ({ ...prev, to: e.target.value }))}
            min={dateRange.from}
            max={new Date().toISOString().split("T")[0]}
          />
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" onClick={handleExportInsights} disabled={!insights.length} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export Insights
              </Button>
            </TooltipTrigger>
            <TooltipContent>Export all insights as CSV for reporting.</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">AI Insights Dashboard</h2>
            <p className="text-gray-600">Intelligent analysis and recommendations for your church</p>
          </div>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={loadAIData} variant="outline">
                <Zap className="h-4 w-4 mr-2" />
                Refresh Analysis
              </Button>
            </TooltipTrigger>
            <TooltipContent>Refresh all AI insights and predictions.</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <TooltipProvider>
        <Tabs defaultValue="insights" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger value="insights" className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Smart Insights
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent>See urgent and important insights for your church.</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger value="predictions" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Predictions
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent>View AI-powered forecasts for growth, attendance, and events.</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger value="recommendations" className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Recommendations
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent>Get actionable recommendations for your ministry.</TooltipContent>
            </Tooltip>
          </TabsList>

          <TabsContent value="insights" className="space-y-4">
            {insights.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">All Good!</h3>
                  <p className="text-gray-600">
                    No critical insights detected. Your church operations are running smoothly.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {insights.map((insight) => (
                  <Card
                    key={insight.id}
                    className="border-l-4"
                    style={{ borderLeftColor: getPriorityColor(insight.priority).replace("bg-", "#") }}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          {getInsightIcon(insight.type)}
                          <div>
                            <CardTitle className="text-lg">{insight.title}</CardTitle>
                            <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="flex items-center gap-1">
                          {getPriorityIcon(insight.priority)}
                          {insight.priority.toUpperCase()}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium text-sm mb-2">Recommended Actions:</h4>
                          <ul className="space-y-1">
                            {insight.actionItems.map((action, index) => (
                              <li key={index} className="flex items-center gap-2 text-sm">
                                <div className="h-1.5 w-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                                {action}
                              </li>
                            ))}
                          </ul>
                        </div>
                        {insight.data && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <p className="text-xs font-medium text-gray-600 mb-1">Related Data:</p>
                            <div className="text-xs text-gray-700">
                              {insight.type === "member_care" && insight.data.members && (
                                <div>
                                  <p>
                                    Members needing attention:{" "}
                                    {insight.data.members.map((m: any) => `${m.first_name} ${m.last_name}`).join(", ")}
                                  </p>
                                </div>
                              )}
                              {insight.type === "attendance" && <p>Current attendance rate: {insight.data.rate}%</p>}
                              {insight.type === "growth" && <p>New members this month: {insight.data.newMembers}</p>}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="predictions" className="space-y-4">
            {predictions && (
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                      Member Growth Prediction
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Next Month Projection</span>
                          <span className="text-2xl font-bold text-green-600">{predictions.memberGrowth.nextMonth}</span>
                        </div>
                        <Progress value={predictions.memberGrowth.confidence * 100} className="h-2" />
                        <p className="text-xs text-gray-600 mt-1">
                          {Math.round(predictions.memberGrowth.confidence * 100)}% confidence
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-500" />
                      Attendance Forecast
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Next Sunday</span>
                          <span className="text-2xl font-bold text-blue-600">
                            {predictions.attendancePrediction.nextSunday}
                          </span>
                        </div>
                        <Progress value={predictions.attendancePrediction.confidence * 100} className="h-2" />
                        <p className="text-xs text-gray-600 mt-1">
                          {Math.round(predictions.attendancePrediction.confidence * 100)}% confidence
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-purple-500" />
                      Event Success Predictions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {predictions.eventSuccess.upcomingEvents.slice(0, 3).map((event: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <h4 className="font-medium">{event.title}</h4>
                            <p className="text-sm text-gray-600">{new Date(event.event_date).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">Expected: {event.predictedAttendance} attendees</p>
                            <p className="text-xs text-gray-600">
                              {Math.round(event.successProbability * 100)}% success rate
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-4">
            {recommendations && (
              <div className="space-y-6">
                {recommendations.recommendations.map((category: any, index: number) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-orange-500" />
                        {category.category}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-3 md:grid-cols-2">
                        {category.items.map((item: string, itemIndex: number) => (
                          <div
                            key={itemIndex}
                            className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-100"
                          >
                            <div className="h-2 w-2 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                            <p className="text-sm">{item}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </TooltipProvider>
    </div>
  )
}
