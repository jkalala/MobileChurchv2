"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Mail, Phone, MapPin, Calendar, Camera, Save, Shield, Bell, Globe, AlertCircle } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { toast } from "@/hooks/use-toast"
import FingerprintManagement from "./fingerprint-management"

const USER_ROLES = [
  { value: "admin", label: "Administrator", description: "Full system access" },
  { value: "pastor", label: "Pastor", description: "Ministry and member management" },
  { value: "leader", label: "Leader", description: "Department and event management" },
  { value: "treasurer", label: "Treasurer", description: "Financial management access" },
  { value: "member", label: "Member", description: "Basic access" },
]

export default function UserProfileSettings() {
  const { user, userProfile, language, setLanguage, isAdmin, hasPermission } = useAuth()
  const [loading, setLoading] = useState(false)
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    bio: "",
    department: "",
    role: "member",
    profileImage: "",
    churchName: "",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    eventReminders: true,
    prayerRequests: true,
    announcements: true,
  })

  useEffect(() => {
    if (userProfile) {
      setProfileData({
        firstName: userProfile.first_name || "",
        lastName: userProfile.last_name || "",
        email: userProfile.email || "",
        phone: userProfile.phone || "",
        address: "",
        dateOfBirth: "",
        bio: "",
        department: "",
        role: userProfile.role || "member",
        profileImage: userProfile.profile_image || "",
        churchName: userProfile.church_name || "",
      })
    }
  }, [userProfile])

  const handleSaveProfile = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/profile/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: user?.id,
          email: profileData.email,
          first_name: profileData.firstName,
          last_name: profileData.lastName,
          phone: profileData.phone,
          church_name: profileData.churchName,
          role: profileData.role,
        }),
      })

      if (res.ok) {
        toast({
          title: "Profile updated successfully",
          description: "Your profile information has been saved.",
        })
      } else {
        throw new Error("Failed to update profile")
      }
    } catch (error) {
      toast({
        title: "Failed to update profile",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileData((prev) => ({
          ...prev,
          profileImage: e.target?.result as string,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-700 border-red-200"
      case "pastor":
        return "bg-purple-100 text-purple-700 border-purple-200"
      case "leader":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "treasurer":
        return "bg-green-100 text-green-700 border-green-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Profile Settings</h2>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          {/* Profile Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profileData.profileImage || "/placeholder.svg?height=80&width=80"} alt="Profile" />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xl font-semibold">
                    {getInitials(profileData.firstName, profileData.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">
                    {profileData.firstName && profileData.lastName
                      ? `${profileData.firstName} ${profileData.lastName}`
                      : profileData.email}
                  </h3>
                  <p className="text-gray-600">{profileData.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={getRoleBadgeColor(profileData.role)}>
                      <Shield className="h-3 w-3 mr-1" />
                      {USER_ROLES.find((r) => r.value === profileData.role)?.label || "No Role"}
                    </Badge>
                    {isAdmin() && (
                      <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                        <Shield className="h-3 w-3 mr-1" />
                        ADMINISTRATOR
                      </Badge>
                    )}
                    {profileData.churchName && (
                      <Badge variant="outline">
                        <MapPin className="h-3 w-3 mr-1" />
                        {profileData.churchName}
                      </Badge>
                    )}
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Camera className="h-4 w-4 mr-2" />
                  Change Photo
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Image */}
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profileData.profileImage || "/placeholder.svg"} />
                  <AvatarFallback className="text-lg">
                    {getInitials(profileData.firstName, profileData.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Label htmlFor="profile-image" className="cursor-pointer">
                    <Button variant="outline" size="sm" asChild>
                      <span>
                        <Camera className="h-4 w-4 mr-2" />
                        Change Photo
                      </span>
                    </Button>
                  </Label>
                  <Input
                    id="profile-image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <p className="text-xs text-gray-500">JPG, PNG or GIF. Max size 2MB.</p>
                </div>
              </div>

              <Separator />

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, firstName: e.target.value }))}
                    placeholder="Enter your first name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input id="email" type="email" value={profileData.email} disabled className="pl-10 bg-gray-50" />
                  </div>
                  <p className="text-xs text-gray-500">Email cannot be changed from this interface</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, phone: e.target.value }))}
                      placeholder="Enter your phone number"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="churchName">Church Name</Label>
                <Input
                  id="churchName"
                  value={profileData.churchName}
                  onChange={(e) => setProfileData((prev) => ({ ...prev, churchName: e.target.value }))}
                  placeholder="Enter your church name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="address"
                    value={profileData.address}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, address: e.target.value }))}
                    placeholder="Enter your address"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={profileData.dateOfBirth}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, dateOfBirth: e.target.value }))}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select
                    value={profileData.department}
                    onValueChange={(value) => setProfileData((prev) => ({ ...prev, department: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="worship">Worship Team</SelectItem>
                      <SelectItem value="youth">Youth Ministry</SelectItem>
                      <SelectItem value="children">Children's Ministry</SelectItem>
                      <SelectItem value="outreach">Outreach</SelectItem>
                      <SelectItem value="administration">Administration</SelectItem>
                      <SelectItem value="media">Media Team</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => setProfileData((prev) => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell us about yourself..."
                  rows={4}
                />
              </div>

              <Separator />

              <div>
                <Label htmlFor="role">Role</Label>
                <Select
                  value={profileData.role}
                  onValueChange={(value) => setProfileData((prev) => ({ ...prev, role: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    {USER_ROLES.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        <div className="flex flex-col">
                          <span className="font-medium">{role.label}</span>
                          <span className="text-xs text-gray-500">{role.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">
                  Your role determines what features and data you can access in the system
                </p>
              </div>

              {/* Role Permissions Info */}
              {profileData.role && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>{USER_ROLES.find((r) => r.value === profileData.role)?.label} Role Permissions:</strong>
                    <br />
                    {USER_ROLES.find((r) => r.value === profileData.role)?.description}
                    {profileData.role === "admin" && (
                      <>
                        <br />• Full access to all features and settings
                        <br />• Can manage other users and system configuration
                      </>
                    )}
                    {profileData.role === "pastor" && (
                      <>
                        <br />• Access to member management and pastoral care
                        <br />• Can manage events and ministry activities
                      </>
                    )}
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex justify-end">
                <Button onClick={handleSaveProfile} disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>Manage your account security and authentication methods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Password Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Password</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" placeholder="Enter current password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" placeholder="Enter new password" />
                  </div>
                </div>
                <Button variant="outline">Update Password</Button>
              </div>

              <Separator />

              {/* Fingerprint Authentication */}
              <FingerprintManagement />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Choose how you want to receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Notification Settings */}
              <div className="space-y-4">
                {Object.entries(notificationSettings).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</p>
                      <p className="text-sm text-gray-500">
                        {key === "emailNotifications" && "Receive notifications via email"}
                        {key === "smsNotifications" && "Receive notifications via SMS"}
                        {key === "pushNotifications" && "Receive push notifications"}
                        {key === "eventReminders" && "Get reminders about upcoming events"}
                        {key === "prayerRequests" && "Receive prayer request notifications"}
                        {key === "announcements" && "Get church announcements and updates"}
                      </p>
                    </div>
                    <Switch
                      checked={value}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          [key]: checked,
                        }))
                      }
                    />
                  </div>
                ))}
              </div>

              <Button onClick={() => toast({ title: "Notification settings saved" })}>
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                App Preferences
              </CardTitle>
              <CardDescription>Customize your app experience and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Language Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Language & Region</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="pt">Português</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select defaultValue="utc">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utc">UTC</SelectItem>
                        <SelectItem value="est">Eastern Time</SelectItem>
                        <SelectItem value="pst">Pacific Time</SelectItem>
                        <SelectItem value="gmt">GMT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Theme Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Appearance</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <Select defaultValue="system">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="density">Display Density</Label>
                    <Select defaultValue="comfortable">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="compact">Compact</SelectItem>
                        <SelectItem value="comfortable">Comfortable</SelectItem>
                        <SelectItem value="spacious">Spacious</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Button onClick={() => toast({ title: "Preferences saved" })}>Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
