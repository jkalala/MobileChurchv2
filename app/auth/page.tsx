"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Church,
  Mail,
  Phone,
  Eye,
  EyeOff,
  Fingerprint,
  Loader2,
  Users,
  Heart,
  User,
  Shield,
  Music,
  BookOpen,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth-provider"

interface RoleInfo {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  color: string
  permissions: string[]
  requiresApproval: boolean
}

const ROLES: RoleInfo[] = [
  {
    id: "member",
    name: "Member",
    description: "Regular church member with basic access to events and community features",
    icon: <User className="h-5 w-5" />,
    color: "bg-blue-500",
    permissions: ["View events", "Join groups", "Access resources", "Submit prayer requests"],
    requiresApproval: false,
  },
  {
    id: "volunteer",
    name: "Volunteer",
    description: "Active volunteer helping with church activities and ministries",
    icon: <Heart className="h-5 w-5" />,
    color: "bg-green-500",
    permissions: ["Member permissions", "Volunteer for events", "Access volunteer resources", "Join ministry teams"],
    requiresApproval: true,
  },
  {
    id: "ministry_leader",
    name: "Ministry Leader",
    description: "Leader of a specific ministry or department within the church",
    icon: <Users className="h-5 w-5" />,
    color: "bg-purple-500",
    permissions: [
      "Volunteer permissions",
      "Manage ministry members",
      "Create ministry events",
      "Access ministry analytics",
    ],
    requiresApproval: true,
  },
  {
    id: "worship_leader",
    name: "Worship Leader",
    description: "Leads worship services and manages music ministry",
    icon: <Music className="h-5 w-5" />,
    color: "bg-pink-500",
    permissions: ["Ministry permissions", "Manage worship sets", "Schedule musicians", "Access music library"],
    requiresApproval: true,
  },
  {
    id: "pastor",
    name: "Pastor/Elder",
    description: "Church pastor or elder with pastoral care and leadership responsibilities",
    icon: <BookOpen className="h-5 w-5" />,
    color: "bg-indigo-500",
    permissions: ["Leadership permissions", "Pastoral care access", "Sermon management", "Member counseling"],
    requiresApproval: true,
  },
  {
    id: "admin",
    name: "Administrator",
    description: "Full system access for church administration and management",
    icon: <Shield className="h-5 w-5" />,
    color: "bg-red-500",
    permissions: ["All permissions", "User management", "System settings", "Financial management"],
    requiresApproval: true,
  },
]

const DEPARTMENTS = [
  "Worship & Music",
  "Children's Ministry",
  "Youth Ministry",
  "Adult Ministry",
  "Outreach & Missions",
  "Administration",
  "Finance",
  "Facilities",
  "Media & Technology",
  "Prayer Ministry",
  "Pastoral Care",
  "Small Groups",
]

export default function AuthPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [authMethod, setAuthMethod] = useState("email")
  const [selectedRole, setSelectedRole] = useState<string>("")
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    churchName: "",
    department: "",
    bio: "",
    experience: "",
    references: "",
  })
  const router = useRouter()
  const { signIn } = useAuth()

  const handleAuth = async (type: "login" | "signup") => {
    setLoading(true)

    try {
      if (type === "login") {
        // Validate login form
        if (!formData.email || !formData.password) {
          toast({
            title: "Missing credentials",
            description: "Please enter both email and password.",
            variant: "destructive",
          })
          return
        }

        // Attempt sign in
        const result = await signIn(formData.email, formData.password)

        if (result.success) {
          toast({
            title: "Welcome back!",
            description: "Redirecting to your dashboard...",
          })
          router.push("/dashboard")
        } else {
          toast({
            title: "Authentication failed",
            description: result.error || "Invalid email or password.",
            variant: "destructive",
          })
        }
      } else {
        // Signup logic
        if (formData.password !== formData.confirmPassword) {
          toast({
            title: "Password mismatch",
            description: "Passwords do not match. Please try again.",
            variant: "destructive",
          })
          return
        }

        if (!selectedRole) {
          toast({
            title: "Role required",
            description: "Please select your role in the church.",
            variant: "destructive",
          })
          return
        }

        // Simulate signup process
        await new Promise((resolve) => setTimeout(resolve, 2000))

        const selectedRoleInfo = ROLES.find((r) => r.id === selectedRole)

        if (selectedRoleInfo?.requiresApproval) {
          toast({
            title: "Account pending approval",
            description: `Your ${selectedRoleInfo.name} account has been created and is pending administrator approval. You'll receive an email once approved.`,
          })
        } else {
          toast({
            title: "Account created successfully!",
            description: "You can now sign in with your credentials.",
          })
        }
      }
    } catch (error) {
      toast({
        title: "Authentication failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSocialAuth = async (provider: string) => {
    setLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: `Signed in with ${provider}`,
        description: "Redirecting to your dashboard...",
      })

      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Authentication failed",
        description: `Unable to sign in with ${provider}. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleBiometricAuth = async () => {
    setLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Biometric authentication successful",
        description: "Welcome back!",
      })

      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Biometric authentication failed",
        description: "Please try again or use another method.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const RoleCard = ({ role }: { role: RoleInfo }) => (
    <div
      className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
        selectedRole === role.id
          ? "border-blue-500 bg-blue-50 shadow-md"
          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
      }`}
      onClick={() => setSelectedRole(role.id)}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg text-white ${role.color}`}>{role.icon}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900">{role.name}</h3>
            {role.requiresApproval && (
              <Badge variant="outline" className="text-xs">
                Requires Approval
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-600 mb-2">{role.description}</p>
          <div className="space-y-1">
            {role.permissions.slice(0, 2).map((permission, index) => (
              <div key={index} className="flex items-center gap-1 text-xs text-gray-500">
                <div className="w-1 h-1 bg-gray-400 rounded-full" />
                {permission}
              </div>
            ))}
            {role.permissions.length > 2 && (
              <div className="text-xs text-gray-400">+{role.permissions.length - 2} more permissions</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
          <CardHeader className="text-center space-y-4 pb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
                <Church className="h-8 w-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Connectus
                </CardTitle>
                <p className="text-sm text-gray-500 font-medium">Church Community</p>
              </div>
            </div>
            <CardDescription className="text-gray-600">
              Connect with your church community and grow in faith together
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <Tabs defaultValue="login" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-xl">
                <TabsTrigger
                  value="login"
                  className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-6">
                {/* Auth Method Selection */}
                <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
                  <Button
                    variant={authMethod === "email" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setAuthMethod("email")}
                    className={`flex-1 rounded-lg transition-all duration-200 ${
                      authMethod === "email" ? "bg-white shadow-sm" : "hover:bg-gray-200"
                    }`}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                  <Button
                    variant={authMethod === "phone" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setAuthMethod("phone")}
                    className={`flex-1 rounded-lg transition-all duration-200 ${
                      authMethod === "phone" ? "bg-white shadow-sm" : "hover:bg-gray-200"
                    }`}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Phone
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-input" className="text-sm font-medium text-gray-700">
                      {authMethod === "email" ? "Email Address" : "Phone Number"}
                    </Label>
                    <Input
                      id="login-input"
                      type={authMethod === "email" ? "email" : "tel"}
                      placeholder={authMethod === "email" ? "joaquim.kalala@gmail.com" : "+1 (555) 123-4567"}
                      value={authMethod === "email" ? formData.email : formData.phone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [authMethod === "email" ? "email" : "phone"]: e.target.value,
                        })
                      }
                      className="h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500 pr-12"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Demo Credentials */}
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm font-medium text-blue-900 mb-1">Demo Credentials:</p>
                    <p className="text-xs text-blue-700">
                      <strong>Admin:</strong> joaquim.kalala@gmail.com / Angola@2025
                    </p>
                    <p className="text-xs text-blue-700">
                      <strong>Member:</strong> member@church.com / password123
                    </p>
                  </div>

                  <Button
                    onClick={() => handleAuth("login")}
                    disabled={loading}
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>

                  {/* Biometric Auth */}
                  <Button
                    variant="outline"
                    className="w-full h-12 rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                    onClick={handleBiometricAuth}
                    disabled={loading}
                  >
                    <Fingerprint className="h-5 w-5 mr-2 text-blue-600" />
                    Use Fingerprint
                  </Button>

                  <div className="text-center">
                    <Button variant="link" size="sm" className="text-blue-600 hover:text-blue-700 font-medium">
                      Forgot Password?
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="signup" className="space-y-6">
                <div className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="first-name" className="text-sm font-medium text-gray-700">
                          First Name *
                        </Label>
                        <Input
                          id="first-name"
                          placeholder="John"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          className="h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last-name" className="text-sm font-medium text-gray-700">
                          Last Name *
                        </Label>
                        <Input
                          id="last-name"
                          placeholder="Doe"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          className="h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-sm font-medium text-gray-700">
                        Email Address *
                      </Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="john@church.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-phone" className="text-sm font-medium text-gray-700">
                        Phone Number
                      </Label>
                      <Input
                        id="signup-phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="signup-password" className="text-sm font-medium text-gray-700">
                          Password *
                        </Label>
                        <div className="relative">
                          <Input
                            id="signup-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a strong password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500 pr-12"
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password" className="text-sm font-medium text-gray-700">
                          Confirm Password *
                        </Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          placeholder="Confirm your password"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          className="h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Role Selection */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Select Your Role *</h3>
                    <p className="text-sm text-gray-600">
                      Choose the role that best describes your position or desired involvement in the church.
                    </p>

                    <div className="grid gap-3">
                      {ROLES.map((role) => (
                        <RoleCard key={role.id} role={role} />
                      ))}
                    </div>
                  </div>

                  {/* Church Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Church Information</h3>

                    <div className="space-y-2">
                      <Label htmlFor="church-name" className="text-sm font-medium text-gray-700">
                        Church Name
                      </Label>
                      <Input
                        id="church-name"
                        placeholder="Igreja Semente Bendita"
                        value={formData.churchName}
                        onChange={(e) => setFormData({ ...formData, churchName: e.target.value })}
                        className="h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="department" className="text-sm font-medium text-gray-700">
                        Department/Ministry
                      </Label>
                      <Select
                        value={formData.department}
                        onValueChange={(value) => setFormData({ ...formData, department: value })}
                      >
                        <SelectTrigger className="h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue placeholder="Select your department" />
                        </SelectTrigger>
                        <SelectContent>
                          {DEPARTMENTS.map((dept) => (
                            <SelectItem key={dept} value={dept}>
                              {dept}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Additional Information for Leadership Roles */}
                  {selectedRole && ROLES.find((r) => r.id === selectedRole)?.requiresApproval && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>
                      <p className="text-sm text-gray-600">
                        Since you're applying for a leadership role, please provide additional information for approval.
                      </p>

                      <div className="space-y-2">
                        <Label htmlFor="bio" className="text-sm font-medium text-gray-700">
                          Brief Bio
                        </Label>
                        <Textarea
                          id="bio"
                          placeholder="Tell us about yourself and your faith journey..."
                          value={formData.bio}
                          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                          className="rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="experience" className="text-sm font-medium text-gray-700">
                          Relevant Experience
                        </Label>
                        <Textarea
                          id="experience"
                          placeholder="Describe your relevant ministry or leadership experience..."
                          value={formData.experience}
                          onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                          className="rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="references" className="text-sm font-medium text-gray-700">
                          References
                        </Label>
                        <Textarea
                          id="references"
                          placeholder="Please provide contact information for 2-3 references..."
                          value={formData.references}
                          onChange={(e) => setFormData({ ...formData, references: e.target.value })}
                          className="rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                          rows={3}
                        />
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={() => handleAuth("signup")}
                    disabled={loading || !selectedRole}
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            {/* Social Auth */}
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleSocialAuth("Google")}
                  disabled={loading}
                  className="h-12 rounded-xl border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all duration-200"
                >
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleSocialAuth("Facebook")}
                  disabled={loading}
                  className="h-12 rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                >
                  <svg className="h-5 w-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </Button>
              </div>
            </div>

            {/* Church Code */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Church className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-sm font-semibold text-blue-900">Church Member?</span>
              </div>
              <p className="text-xs text-blue-700 leading-relaxed">
                Ask your pastor for the church invitation code to join your community and access exclusive features.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
