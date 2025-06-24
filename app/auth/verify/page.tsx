"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Phone, CheckCircle, Loader2, ArrowLeft } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

export default function VerifyPage() {
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [error, setError] = useState("")
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
  const router = useRouter()
  const searchParams = useSearchParams()

  const method = searchParams.get("method") || "email"
  const contact = searchParams.get("contact") || ""

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleVerification = async () => {
    if (code.length !== 6) {
      setError("Please enter a 6-digit code")
      return
    }

    setLoading(true)
    setError("")

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      router.push("/dashboard")
    } catch (error) {
      setError("Invalid verification code. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    setResendLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setTimeLeft(300) // Reset timer
      setCode("")
      setError("")
    } catch (error) {
      setError("Failed to resend code")
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-xl">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            {method === "email" ? (
              <Mail className="h-8 w-8 text-blue-600" />
            ) : (
              <Phone className="h-8 w-8 text-blue-600" />
            )}
          </div>
          <CardTitle>Verify Your {method === "email" ? "Email" : "Phone Number"}</CardTitle>
          <CardDescription>
            We've sent a 6-digit verification code to <span className="font-medium text-gray-900">{contact}</span>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="verification-code">Verification Code</Label>
            <Input
              id="verification-code"
              placeholder="000000"
              value={code}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 6)
                setCode(value)
                if (error) setError("")
              }}
              className="text-center text-lg tracking-widest font-mono mt-1"
              maxLength={6}
            />
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              Code expires in: <span className="font-medium text-red-600">{formatTime(timeLeft)}</span>
            </p>
          </div>

          <Button
            onClick={handleVerification}
            disabled={loading || code.length !== 6}
            className="w-full bg-indigo-600 hover:bg-indigo-700"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Verify & Continue
              </>
            )}
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
            <Button
              variant="link"
              size="sm"
              className="text-indigo-600 p-0"
              onClick={handleResendCode}
              disabled={resendLoading || timeLeft > 240} // Can resend after 1 minute
            >
              {resendLoading ? (
                <>
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  Sending...
                </>
              ) : timeLeft > 240 ? (
                `Resend in ${formatTime(timeLeft - 240)}`
              ) : (
                "Resend Code"
              )}
            </Button>
          </div>

          <div className="border-t pt-4">
            <Button variant="ghost" onClick={() => router.push("/auth")} className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Sign Up
            </Button>
          </div>

          {/* Help Section */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 text-center">
              Having trouble? Check your spam folder or{" "}
              <Button variant="link" className="p-0 h-auto text-xs text-indigo-600">
                contact support
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
