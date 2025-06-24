"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Fingerprint,
  Plus,
  Trash2,
  Smartphone,
  Calendar,
  Clock,
  AlertTriangle,
  Shield,
  CheckCircle,
} from "lucide-react"
import { fingerprintService, type FingerprintCredential } from "@/lib/fingerprint-service"
import { useAuth } from "@/components/auth-provider"
import { toast } from "@/hooks/use-toast"
import FingerprintScanner from "./fingerprint-scanner"
import { formatDistanceToNow } from "date-fns"

export default function FingerprintManagement() {
  const [fingerprints, setFingerprints] = useState<FingerprintCredential[]>([])
  const [isEnrollDialogOpen, setIsEnrollDialogOpen] = useState(false)
  const [deviceName, setDeviceName] = useState("")
  const [isSupported, setIsSupported] = useState(false)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    checkSupportAndLoadFingerprints()
  }, [user])

  const checkSupportAndLoadFingerprints = async () => {
    setLoading(true)

    const supported = fingerprintService.isSupported()
    setIsSupported(supported)

    if (supported && user) {
      const userFingerprints = fingerprintService.getUserFingerprints(user.id)
      setFingerprints(userFingerprints)
    }

    setLoading(false)
  }

  const handleEnrollSuccess = (credentialId: string) => {
    setIsEnrollDialogOpen(false)
    setDeviceName("")
    checkSupportAndLoadFingerprints()
    toast({
      title: "Fingerprint enrolled successfully",
      description: "Your fingerprint has been added to your account",
    })
  }

  const handleEnrollError = (error: string) => {
    toast({
      title: "Enrollment failed",
      description: error,
      variant: "destructive",
    })
  }

  const handleRemoveFingerprint = async (credentialId: string) => {
    if (!user) return

    try {
      const success = await fingerprintService.removeFingerprint(user.id, credentialId)

      if (success) {
        setFingerprints((prev) => prev.filter((fp) => fp.id !== credentialId))
        toast({
          title: "Fingerprint removed",
          description: "The fingerprint has been removed from your account",
        })
      } else {
        toast({
          title: "Failed to remove fingerprint",
          description: "Please try again",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error removing fingerprint",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  const handleClearAllFingerprints = async () => {
    if (!user) return

    try {
      const success = await fingerprintService.clearAllFingerprints(user.id)

      if (success) {
        setFingerprints([])
        toast({
          title: "All fingerprints removed",
          description: "All fingerprints have been removed from your account",
        })
      } else {
        toast({
          title: "Failed to clear fingerprints",
          description: "Please try again",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error clearing fingerprints",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  const getDeviceIcon = (deviceName: string) => {
    if (deviceName.toLowerCase().includes("iphone") || deviceName.toLowerCase().includes("ios")) {
      return <Smartphone className="h-4 w-4" />
    }
    if (deviceName.toLowerCase().includes("android")) {
      return <Smartphone className="h-4 w-4" />
    }
    return <Fingerprint className="h-4 w-4" />
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fingerprint className="h-5 w-5" />
            Fingerprint Authentication
          </CardTitle>
          <CardDescription>Loading fingerprint settings...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fingerprint className="h-5 w-5" />
            Fingerprint Authentication
          </CardTitle>
          <CardDescription>Secure biometric authentication</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Fingerprint authentication is not supported on this browser or device. Please use a modern browser with
              WebAuthn support.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Fingerprint className="h-5 w-5" />
          Fingerprint Authentication
        </CardTitle>
        <CardDescription>Manage your fingerprints for secure and convenient access</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Security Info */}
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Your fingerprints are stored securely on your device and never sent to our servers.
          </AlertDescription>
        </Alert>

        {/* Enrolled Fingerprints */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Enrolled Fingerprints</h3>
            <Badge variant="secondary">{fingerprints.length} enrolled</Badge>
          </div>

          {fingerprints.length === 0 ? (
            <div className="text-center py-8 space-y-4">
              <Fingerprint className="h-12 w-12 text-gray-400 mx-auto" />
              <div>
                <p className="text-gray-500 font-medium">No fingerprints enrolled</p>
                <p className="text-sm text-gray-400">Add a fingerprint to enable quick authentication</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {fingerprints.map((fingerprint) => (
                <div
                  key={fingerprint.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {getDeviceIcon(fingerprint.deviceName)}
                    <div>
                      <p className="font-medium">{fingerprint.deviceName}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Added {formatDistanceToNow(new Date(fingerprint.createdAt), { addSuffix: true })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Used {formatDistanceToNow(new Date(fingerprint.lastUsed), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {fingerprint.counter} uses
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFingerprint(fingerprint.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Dialog open={isEnrollDialogOpen} onOpenChange={setIsEnrollDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex-1">
                <Plus className="h-4 w-4 mr-2" />
                Add Fingerprint
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Fingerprint</DialogTitle>
                <DialogDescription>Give your device a name and enroll your fingerprint</DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="device-name">Device Name</Label>
                  <Input
                    id="device-name"
                    placeholder="e.g., iPhone 15, MacBook Pro"
                    value={deviceName}
                    onChange={(e) => setDeviceName(e.target.value)}
                  />
                </div>

                <FingerprintScanner
                  mode="enroll"
                  deviceName={deviceName || "Unknown Device"}
                  onSuccess={handleEnrollSuccess}
                  onError={handleEnrollError}
                  onCancel={() => setIsEnrollDialogOpen(false)}
                />
              </div>
            </DialogContent>
          </Dialog>

          {fingerprints.length > 0 && (
            <Button
              variant="outline"
              onClick={handleClearAllFingerprints}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Remove All
            </Button>
          )}
        </div>

        {/* Quick Test */}
        {fingerprints.length > 0 && (
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Test Authentication</h4>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Fingerprint className="h-4 w-4 mr-2" />
                  Test Fingerprint Login
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Test Fingerprint Authentication</DialogTitle>
                  <DialogDescription>
                    Verify that your fingerprint authentication is working correctly
                  </DialogDescription>
                </DialogHeader>

                <FingerprintScanner
                  mode="verify"
                  onSuccess={(credentialId) => {
                    toast({
                      title: "Test successful!",
                      description: "Your fingerprint authentication is working correctly",
                    })
                  }}
                  onError={(error) => {
                    toast({
                      title: "Test failed",
                      description: error,
                      variant: "destructive",
                    })
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
