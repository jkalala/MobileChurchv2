"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, Users, DollarSign, Calendar, Award, Smartphone, Shield, Globe } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function OnboardingPage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const router = useRouter()

  const slides = [
    {
      icon: () => (
        <Image src="/images/semente-bendita-logo.png" alt="Connectus" width={80} height={80} className="mx-auto" />
      ),
      title: "Welcome to Connectus",
      subtitle: "Mobile Church Platform",
      description: "Your all-in-one solution for modern church administration, connecting your community digitally.",
      features: ["Member Management", "Financial Tracking", "Event Planning"],
      color: "from-blue-500 to-indigo-600",
    },
    {
      icon: Users,
      title: "Member Management",
      subtitle: "Know Your Flock",
      description: "Track members, families, and attendance with face recognition for child safety.",
      features: ["Family Grouping", "Attendance Tracking", "Child Safety"],
      color: "from-green-500 to-emerald-600",
    },
    {
      icon: DollarSign,
      title: "Financial Management",
      subtitle: "PIX & Mobile Integration",
      description: "Accept tithes and offerings through PIX, credit cards, and mobile payments.",
      features: ["PIX Payments", "Budget Tracking", "AI Insights"],
      color: "from-purple-500 to-violet-600",
    },
    {
      icon: Calendar,
      title: "Events & Ministries",
      subtitle: "Stay Connected",
      description: "Manage church events, choir practice, and private ministry hubs.",
      features: ["Event Planning", "RSVP System", "Ministry Hubs"],
      color: "from-orange-500 to-red-600",
    },
    {
      icon: Award,
      title: "Gamification",
      subtitle: "Spiritual Growth",
      description: "Earn badges and track spiritual milestones with our reward system.",
      features: ["Achievement Badges", "Leaderboards", "Streak Tracking"],
      color: "from-pink-500 to-rose-600",
    },
  ]

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    } else {
      router.push("/auth")
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  const slide = slides[currentSlide]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center gap-3">
          <Image src="/images/semente-bendita-logo.png" alt="Connectus" width={32} height={32} />
          <div>
            <span className="font-semibold text-gray-900 block text-sm">Connectus</span>
            <span className="font-semibold text-gray-900 block text-sm">Mobile Church</span>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={() => router.push("/auth")}>
          Skip
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center px-6 pb-8">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-8 text-center">
            {/* Icon */}
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
              {currentSlide === 0 ? <slide.icon /> : <slide.icon className="h-10 w-10 text-white" />}
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{slide.title}</h1>
            <p className="text-lg text-indigo-600 font-medium mb-4">{slide.subtitle}</p>

            {/* Description */}
            <p className="text-gray-600 mb-6 leading-relaxed">{slide.description}</p>

            {/* Features */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {slide.features.map((feature, index) => (
                <Badge key={index} variant="secondary" className="bg-indigo-50 text-indigo-700">
                  {feature}
                </Badge>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <Button variant="ghost" onClick={prevSlide} disabled={currentSlide === 0} className="text-gray-500">
                Previous
              </Button>

              <div className="flex gap-2">
                {slides.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentSlide ? "bg-indigo-600" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>

              <Button onClick={nextSlide} className="bg-indigo-600 hover:bg-indigo-700">
                {currentSlide === slides.length - 1 ? "Get Started" : "Next"}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 bg-green-100 rounded-full flex items-center justify-center">
              <Smartphone className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-xs text-gray-600">Offline Mode</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 bg-blue-100 rounded-full flex items-center justify-center">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-xs text-gray-600">Secure</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 bg-purple-100 rounded-full flex items-center justify-center">
              <Globe className="h-6 w-6 text-purple-600" />
            </div>
            <p className="text-xs text-gray-600">Multi-language</p>
          </div>
        </div>
      </div>
    </div>
  )
}
