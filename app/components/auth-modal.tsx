"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { X, Church, Mail, Phone, Eye, EyeOff, Fingerprint, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import FingerprintScanner from "./fingerprint-scanner"
import { fingerprintService } from "@/lib/fingerprint-service"

interface AuthModalProps {
  onClose: () => void
}

export default function AuthModal({ onClose }: AuthModalProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [authMethod, setAuthMethod] = useState("email")
  const [showFingerprintDialog, setShowFingerprintDialog] = useState(false)
  const [fingerprintSupported, setFingerprintSupported] = useState(false)
  const router = useRouter()

  // Check fingerprint support on component mount
  useState(() => {
    const checkSupport = async () => {
      const supported = fingerprintService.isSupported()
      const biometricAvailable = supported ? await fingerprintService.isBiometricAvailable() : false
      setFingerprintSupported(supported && biometricAvailable)
    }
    checkSupport()
  })

  const handleAuth = async (type: "login" | "signup") => {
    setLoading(true)
    try {
      // Simulate authentication
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: type === "login" ? "Welcome back!" : "Account created successfully!",
        description: "Redirecting to your dashboard...",
      })

      router.push("/dashboard")
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

  const handleSocialAuth = (provider: string) => {
    setLoading(true)
    // Simulate social auth
    setTimeout(() => {
      setLoading(false)
      toast({
        title: `Signed in with ${provider}`,
        description: "Redirecting to your dashboard...",
      })
      router.push("/dashboard")
    }, 1500)
  }

  const handleFingerprintAuth = () => {
    setShowFingerprintDialog(true)
  }

  const handleFingerprintSuccess = (credentialId: string) => {
    setShowFingerprintDialog(false)
    toast({
      title: "Fingerprint authentication successful",
      description: "Welcome back!",
    })
    router.push("/dashboard")
  }

  const handleFingerprintError = (error: string) => {
    toast({
      title: "Fingerprint authentication failed",
      description: error,
      variant: "destructive",
    })
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-md bg-white">
          <CardHeader className="relative">
            <Button variant="ghost" size="icon" onClick={onClose} className="absolute right-2 top-2">
              <X className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2 mb-2">
              <Church className="h-6 w-6 text-indigo-600" />
              <CardTitle>Welcome Back</CardTitle>
            </div>
            <CardDescription>Sign in to access your church community</CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="login" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                {/* Auth Method Selection */}
                <div className="flex gap-2 mb-4">
                  <Button
                    variant={authMethod === "email" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setAuthMethod("email")}
                    className="flex-1"
                  >
                    <Mail className="h-4 w-4 mr-1" />
                    Email
                  </Button>
                  <Button
                    variant={authMethod === "phone" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setAuthMethod("phone")}
                    className="flex-1"
                  >
                    <Phone className="h-4 w-4 mr-1" />
                    Phone
                  </Button>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label htmlFor="login-input">{authMethod === "email" ? "Email Address" : "Phone Number"}</Label>
                    <Input
                      id="login-input"
                      type={authMethod === "email" ? "email" : "tel"}
                      placeholder={authMethod === "email" ? "john@church.com" : "+254 700 123 456"}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="password">Password</Label>
                    <div className="relative mt-1">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <Button onClick={() => handleAuth("login")} disabled={loading} className="w-full">
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
                  {fingerprintSupported && (
                    <Button variant="outline" className="w-full" onClick={handleFingerprintAuth} disabled={loading}>
                      <Fingerprint className="h-4 w-4 mr-2" />
                      Use Fingerprint
                    </Button>
                  )}

                  <div className="text-center">
                    <Button variant="link" size="sm" className="text-indigo-600">
                      Forgot Password?
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="first-name">First Name</Label>
                      <Input id="first-name" placeholder="John" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input id="last-name" placeholder="Doe" className="mt-1" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="signup-email">Email Address</Label>
                    <Input id="signup-email" type="email" placeholder="john@church.com" className="mt-1" />
                  </div>

                  <div>
                    <Label htmlFor="signup-phone">Phone Number</Label>
                    <Input id="signup-phone" type="tel" placeholder="+254 700 123 456" className="mt-1" />
                  </div>

                  <div>
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative mt-1">
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <Button onClick={() => handleAuth("signup")} disabled={loading} className="w-full">
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
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={() => handleSocialAuth("google")} disabled={loading}>
                  <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google
                </Button>
                <Button variant="outline" onClick={() => handleSocialAuth("facebook")} disabled={loading}>
                  <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </Button>
              </div>
            </div>

            {/* Church Code */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Church className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Church Member?</span>
              </div>
              <p className="text-xs text-blue-700">
                Ask your pastor for the church invitation code to join your community.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fingerprint Authentication Dialog */}
      <Dialog open={showFingerprintDialog} onOpenChange={setShowFingerprintDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Fingerprint Authentication</DialogTitle>
            <DialogDescription>Use your fingerprint to sign in securely</DialogDescription>
          </DialogHeader>

          <FingerprintScanner
            mode="verify"
            onSuccess={handleFingerprintSuccess}
            onError={handleFingerprintError}
            onCancel={() => setShowFingerprintDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
