"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Music, Users, FileText, Play, Download, Plus, Mic } from "lucide-react"

export default function ChoirModule() {
  const [selectedSong, setSelectedSong] = useState(null)

  const choirMembers = [
    {
      id: 1,
      name: "Sarah Johnson",
      voiceType: "Soprano",
      experience: "Advanced",
      attendance: 95,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      name: "Grace Mwangi",
      voiceType: "Alto",
      experience: "Intermediate",
      attendance: 88,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      name: "Michael Okafor",
      voiceType: "Tenor",
      experience: "Advanced",
      attendance: 92,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 4,
      name: "David Asante",
      voiceType: "Bass",
      experience: "Expert",
      attendance: 97,
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  const sheetMusic = [
    {
      id: 1,
      title: "Amazing Grace",
      composer: "John Newton",
      key: "G Major",
      difficulty: "Beginner",
      duration: "4:30",
      hasAudio: true,
      category: "Hymn",
    },
    {
      id: 2,
      title: "How Great Thou Art",
      composer: "Carl Boberg",
      key: "Bb Major",
      difficulty: "Intermediate",
      duration: "5:15",
      hasAudio: true,
      category: "Hymn",
    },
    {
      id: 3,
      title: "Blessed Assurance",
      composer: "Fanny Crosby",
      key: "D Major",
      difficulty: "Beginner",
      duration: "3:45",
      hasAudio: false,
      category: "Hymn",
    },
    {
      id: 4,
      title: "Waymaker",
      composer: "Sinach",
      key: "C Major",
      difficulty: "Intermediate",
      duration: "6:20",
      hasAudio: true,
      category: "Contemporary",
    },
  ]

  const getVoiceTypeColor = (voiceType: string) => {
    const colors = {
      Soprano: "bg-pink-100 text-pink-800",
      Alto: "bg-purple-100 text-purple-800",
      Tenor: "bg-blue-100 text-blue-800",
      Bass: "bg-green-100 text-green-800",
    }
    return colors[voiceType as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      Beginner: "bg-green-100 text-green-800",
      Intermediate: "bg-yellow-100 text-yellow-800",
      Advanced: "bg-orange-100 text-orange-800",
      Expert: "bg-red-100 text-red-800",
    }
    return colors[difficulty as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Choir Management</h2>
          <p className="text-gray-600">Manage choir members, sheet music, and vocal arrangements</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
          <Button variant="outline" className="bg-white/80 text-gray-700">
            <Music className="h-4 w-4 mr-2" />
            Upload Music
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Active Members</p>
                <p className="text-xl font-bold">24</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Sheet Music</p>
                <p className="text-xl font-bold">156</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Mic className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Voice Types</p>
                <p className="text-xl font-bold">4</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Music className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">This Week</p>
                <p className="text-xl font-bold">3 Practices</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="members" className="space-y-4">
        <TabsList className="bg-white/80 backdrop-blur-sm">
          <TabsTrigger value="members">Choir Members</TabsTrigger>
          <TabsTrigger value="music">Sheet Music</TabsTrigger>
          <TabsTrigger value="practice">Practice Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="members">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Choir Members & Voice Types</CardTitle>
              <CardDescription>Manage choir members and their vocal range assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {choirMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                        <AvatarFallback>
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-gray-900">{member.name}</h3>
                        <div className="flex gap-2 mt-1">
                          <Badge className={getVoiceTypeColor(member.voiceType)}>{member.voiceType}</Badge>
                          <Badge variant="secondary">{member.experience}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">{member.attendance}%</span>
                        <div className="w-16 h-2 bg-gray-200 rounded-full">
                          <div className="h-2 bg-green-500 rounded-full" style={{ width: `${member.attendance}%` }} />
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">Attendance</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Voice Distribution */}
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <h3 className="font-medium mb-3">Voice Type Distribution</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-2xl font-bold text-pink-600">6</span>
                    </div>
                    <p className="text-sm font-medium">Soprano</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-2xl font-bold text-purple-600">7</span>
                    </div>
                    <p className="text-sm font-medium">Alto</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-2xl font-bold text-blue-600">6</span>
                    </div>
                    <p className="text-sm font-medium">Tenor</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-2xl font-bold text-green-600">5</span>
                    </div>
                    <p className="text-sm font-medium">Bass</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="music">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Sheet Music Repository</CardTitle>
              <CardDescription>Browse and manage choir sheet music with audio previews</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sheetMusic.map((song) => (
                  <div key={song.id} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-2">
                          <Music className="h-5 w-5 text-indigo-600 mt-1" />
                          <div>
                            <h3 className="font-semibold text-gray-900">{song.title}</h3>
                            <p className="text-sm text-gray-600">by {song.composer}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <Badge variant="outline">{song.key}</Badge>
                              <Badge className={getDifficultyColor(song.difficulty)}>{song.difficulty}</Badge>
                              <Badge variant="secondary">{song.category}</Badge>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600 ml-8">
                          <span>Duration: {song.duration}</span>
                          {song.hasAudio && (
                            <Badge variant="outline" className="bg-green-50 text-green-700">
                              Audio Available
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {song.hasAudio && (
                          <Button variant="outline" size="sm" className="bg-white text-gray-700">
                            <Play className="h-4 w-4 mr-1" />
                            Preview
                          </Button>
                        )}
                        <Button variant="outline" size="sm" className="bg-white text-gray-700">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                        <Button variant="outline" size="sm" className="bg-white text-gray-700">
                          View Sheet
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="practice">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Practice Schedule</CardTitle>
              <CardDescription>Manage choir practice sessions and attendance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-blue-900">Wednesday Evening Practice</h3>
                      <p className="text-sm text-blue-700 mt-1">January 24, 2024 • 7:00 PM - 9:00 PM</p>
                      <p className="text-sm text-blue-600 mt-1">Music Room • Focus: Sunday Service Songs</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">Upcoming</Badge>
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-green-900">Saturday Morning Rehearsal</h3>
                      <p className="text-sm text-green-700 mt-1">January 27, 2024 • 9:00 AM - 11:00 AM</p>
                      <p className="text-sm text-green-600 mt-1">Main Sanctuary • Final rehearsal before service</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Scheduled</Badge>
                  </div>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-purple-900">Special Event Preparation</h3>
                      <p className="text-sm text-purple-700 mt-1">January 30, 2024 • 6:00 PM - 8:00 PM</p>
                      <p className="text-sm text-purple-600 mt-1">Music Room • Easter cantata preparation</p>
                    </div>
                    <Badge className="bg-purple-100 text-purple-800">Planning</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
