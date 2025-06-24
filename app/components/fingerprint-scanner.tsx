"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Fingerprint, CheckCircle, XCircle, AlertTriangle, Loader2, Smartphone } from "lucide-react"
import { fingerprintService } from "@/lib/fingerprint-service"
import { useAuth } from "@/components/auth-provider"
import { toast } from "@/hooks/use-toast"

interface FingerprintScannerProps {
  mode: "enroll" | "verify"
  onSuccess?: (credentialId: string) => void
  onError?: (error: string) => void
  onCancel?: () => void
  deviceName?: string
}

type ScanState = "idle" | "scanning" | "success" | "error" | "not-supported"

export default function FingerprintScanner({
  mode,
  onSuccess,
  onError,
  onCancel,
  deviceName,
}: FingerprintScannerProps) {
  const [scanState, setScanState] = useState<ScanState>("idle")
  const [error, setError] = useState<string>("")
  const [isSupported, setIsSupported] = useState<boolean>(false)
  const [isBiometricAvailable, setIsBiometricAvailable] = useState<boolean>(false)
  const { user } = useAuth()

  useEffect(() => {
    checkSupport()
  }, [])

  const checkSupport = async () => {
    const supported = fingerprintService.isSupported()
    setIsSupported(supported)

    if (supported) {
      const biometricAvailable = await fingerprintService.isBiometricAvailable()
      setIsBiometricAvailable(biometricAvailable)

      if (!biometricAvailable) {
        setScanState("not-supported")
        setError("Biometric authentication is not available on this device")
      }
    } else {
      setScanState("not-supported")
      setError("Fingerprint authentication is not supported on this browser")
    }
  }

  const handleScan = async () => {
    if (!user) {
      setError("User not authenticated")
      return
    }

    setScanState("scanning")
    setError("")

    try {
      if (mode === "enroll") {
        const result = await fingerprintService.enrollFingerprint(user.id, deviceName)

        if (result.success && result.credentialId) {
          setScanState("success")
          toast({
            title: "Fingerprint enrolled successfully",
            description: "You can now use your fingerprint to sign in",
          })
          onSuccess?.(result.credentialId)
        } else {
          setScanState("error")
          setError(result.error || "Failed to enroll fingerprint")
          onError?.(result.error || "Failed to enroll fingerprint")
        }
      } else {
        const result = await fingerprintService.verifyFingerprint(user.id)

        if (result.success && result.credentialId) {
          setScanState("success")
          toast({
            title: "Fingerprint verified successfully",
            description: "Authentication successful",
          })
          onSuccess?.(result.credentialId)
        } else {
          setScanState("error")
          setError(result.error || "Failed to verify fingerprint")
          onError?.(result.error || "Failed to verify fingerprint")
        }
      }
    } catch (error: any) {
      setScanState("error")
      const errorMessage = error.message || "Fingerprint authentication failed"
      setError(errorMessage)
      onError?.(errorMessage)
    }
  }

  const handleRetry = () => {
    setScanState("idle")
    setError("")
  }

  const getScanStateIcon = () => {
    switch (scanState) {
      case "scanning":
        return <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />
      case "success":
        return <CheckCircle className="h-16 w-16 text-green-500" />
      case "error":
        return <XCircle className="h-16 w-16 text-red-500" />
      case "not-supported":
        return <AlertTriangle className="h-16 w-16 text-yellow-500" />
      default:
        return <Fingerprint className="h-16 w-16 text-gray-400" />
    }
  }

  const getScanStateMessage = () => {
    switch (scanState) {
      case "scanning":
        return mode === "enroll"
          ? "Place your finger on the sensor to enroll your fingerprint"
          : "Place your finger on the sensor to authenticate"
      case "success":
        return mode === "enroll" ? "Fingerprint enrolled successfully!" : "Authentication successful!"
      case "error":
        return error || "Authentication failed"
      case "not-supported":
        return "Fingerprint authentication is not available"
      default:
        return mode === "enroll" ? "Ready to enroll your fingerprint" : "Ready to authenticate with your fingerprint"
    }
  }

  const getScanStateColor = () => {
    switch (scanState) {
      case "scanning":
        return "border-blue-200 bg-blue-50"
      case "success":
        return "border-green-200 bg-green-50"
      case "error":
        return "border-red-200 bg-red-50"
      case "not-supported":
        return "border-yellow-200 bg-yellow-50"
      default:
        return "border-gray-200 bg-gray-50"
    }
  }

  if (!isSupported || !isBiometricAvailable) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center gap-2 justify-center">
            <Smartphone className="h-5 w-5" />
            Fingerprint Authentication
          </CardTitle>
          <CardDescription>Secure biometric authentication</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {!isSupported
                ? "Your browser doesn't support fingerprint authentication. Please use a modern browser with WebAuthn support."
                : "Biometric authentication is not available on this device. Make sure you have fingerprint or face recognition set up in your device settings."}
            </AlertDescription>
          </Alert>

          <div className="flex gap-2">
            {onCancel && (
              <Button variant="outline" onClick={onCancel} className="flex-1">
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center gap-2 justify-center">
          <Fingerprint className="h-5 w-5" />
          {mode === "enroll" ? "Enroll Fingerprint" : "Fingerprint Authentication"}
        </CardTitle>
        <CardDescription>
          {mode === "enroll" ? "Add your fingerprint for secure access" : "Use your fingerprint to authenticate"}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Scan Area */}
        <div
          className={`relative p-8 rounded-2xl border-2 border-dashed transition-all duration-300 ${getScanStateColor()}`}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              {getScanStateIcon()}
              {scanState === "scanning" && (
                <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
              )}
            </div>

            <div className="text-center space-y-2">
              <p className="font-medium text-gray-900">{getScanStateMessage()}</p>

              {scanState === "scanning" && (
                <p className="text-sm text-gray-500">Follow your device's prompts to complete authentication</p>
              )}

              {scanState === "idle" && (
                <p className="text-sm text-gray-500">
                  {mode === "enroll"
                    ? "Your fingerprint will be stored securely on your device"
                    : "Touch the fingerprint sensor when ready"}
                </p>
              )}
            </div>

            {/* Status Badge */}
            {scanState !== "idle" && (
              <Badge
                variant={
                  scanState === "success"
                    ? "default"
                    : scanState === "error"
                      ? "destructive"
                      : scanState === "scanning"
                        ? "secondary"
                        : "outline"
                }
                className="mt-2"
              >
                {scanState === "success" && "Success"}
                {scanState === "error" && "Failed"}
                {scanState === "scanning" && "Scanning..."}
                {scanState === "not-supported" && "Not Available"}
              </Badge>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && scanState === "error" && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          {scanState === "idle" && (
            <Button onClick={handleScan} className="flex-1">
              <Fingerprint className="h-4 w-4 mr-2" />
              {mode === "enroll" ? "Enroll Fingerprint" : "Authenticate"}
            </Button>
          )}

          {scanState === "error" && (
            <Button onClick={handleRetry} className="flex-1">
              Try Again
            </Button>
          )}

          {scanState === "success" && mode === "enroll" && (
            <Button onClick={() => setScanState("idle")} className="flex-1">
              Enroll Another
            </Button>
          )}

          {onCancel && scanState !== "scanning" && (
            <Button variant="outline" onClick={onCancel} className="flex-1">
              {scanState === "success" ? "Done" : "Cancel"}
            </Button>
          )}
        </div>

        {/* Instructions */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>• Make sure your finger is clean and dry</p>
          <p>• Place your finger firmly on the sensor</p>
          <p>• Follow any prompts from your device</p>
        </div>
      </CardContent>
    </Card>
  )
}
