"use client"

import { useState } from "react"
import { DialogShell } from "./_shared/dialog-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Navigation, CheckCircle, AlertCircle, Clock, Users, Smartphone } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Member } from "@/lib/database"

interface LocationData {
  latitude: number
  longitude: number
  accuracy: number
  timestamp: number
}

interface CheckInRecord {
  member: Member
  location: LocationData
  timestamp: number
  distance: number
}

interface GPSCheckInModalProps {
  members: Member[]
  onClose?: () => void
}

export function GPSCheckInModal({ members, onClose }: GPSCheckInModalProps) {
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [checkInRecords, setCheckInRecords] = useState<CheckInRecord[]>([])
  const [churchLocation] = useState({
    latitude: -8.8137,
    longitude: 13.2302,
    name: "Igreja Semente Bendita",
  })

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371 // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180)
    const dLon = (lon2 - lon1) * (Math.PI / 180)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = R * c * 1000 // Distance in meters
    return distance
  }

  const getCurrentLocation = () => {
    setIsGettingLocation(true)

    if (!navigator.geolocation) {
      alert("Geolocalização não é suportada neste navegador")
      setIsGettingLocation(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: Date.now(),
        }
        setCurrentLocation(location)
        setIsGettingLocation(false)
      },
      (error) => {
        console.error("Erro ao obter localização:", error)
        alert("Erro ao obter localização. Verifique as permissões.")
        setIsGettingLocation(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    )
  }

  const handleCheckIn = (member: Member) => {
    if (!currentLocation) {
      alert("Localização não disponível. Clique em 'Obter Localização' primeiro.")
      return
    }

    const distance = calculateDistance(
      currentLocation.latitude,
      currentLocation.longitude,
      churchLocation.latitude,
      churchLocation.longitude,
    )

    const checkInRecord: CheckInRecord = {
      member,
      location: currentLocation,
      timestamp: Date.now(),
      distance,
    }

    setCheckInRecords([...checkInRecords, checkInRecord])
  }

  const isWithinChurchRadius = (distance: number) => {
    return distance <= 100 // 100 meters radius
  }

  const formatDistance = (distance: number) => {
    if (distance < 1000) {
      return `${Math.round(distance)}m`
    }
    return `${(distance / 1000).toFixed(1)}km`
  }

  const getLocationStatus = () => {
    if (!currentLocation) return null

    const distance = calculateDistance(
      currentLocation.latitude,
      currentLocation.longitude,
      churchLocation.latitude,
      churchLocation.longitude,
    )

    return {
      distance,
      isNearChurch: isWithinChurchRadius(distance),
    }
  }

  const locationStatus = getLocationStatus()

  return (
    <DialogShell isOpen={true} onClose={onClose || (() => {})} title="GPS Check-in">
      <p className="text-sm text-muted-foreground mb-4">This is a demo stub. Integrate a real geolocation API later.</p>
      <Button disabled>Check in (demo)</Button>

      <div className="space-y-6 mt-4">
        {/* Location Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="h-5 w-5" />
              Status da Localização
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Localização Atual:</span>
                <Button onClick={getCurrentLocation} disabled={isGettingLocation} size="sm">
                  {isGettingLocation ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Obtendo...
                    </>
                  ) : (
                    <>
                      <Smartphone className="h-4 w-4 mr-2" />
                      Obter Localização
                    </>
                  )}
                </Button>
              </div>

              {currentLocation && (
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">
                    <p>Latitude: {currentLocation.latitude.toFixed(6)}</p>
                    <p>Longitude: {currentLocation.longitude.toFixed(6)}</p>
                    <p>Precisão: {Math.round(currentLocation.accuracy)}m</p>
                  </div>

                  {locationStatus && (
                    <Alert>
                      {locationStatus.isNearChurch ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <AlertCircle className="h-4 w-4" />
                      )}
                      <AlertDescription>
                        {locationStatus.isNearChurch ? (
                          <span className="text-green-700">
                            Você está na igreja! Distância: {formatDistance(locationStatus.distance)}
                          </span>
                        ) : (
                          <span className="text-orange-700">
                            Você está longe da igreja. Distância: {formatDistance(locationStatus.distance)}
                          </span>
                        )}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Members Check-in */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Check-in de Membros
            </CardTitle>
            <CardDescription>Registre a presença dos membros baseado na localização</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {members.slice(0, 8).map((member) => {
                const hasCheckedIn = checkInRecords.some((record) => record.member.id === member.id)
                const checkInRecord = checkInRecords.find((record) => record.member.id === member.id)

                return (
                  <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={member.profile_image || "/placeholder.svg"} />
                        <AvatarFallback>
                          {member.first_name[0]}
                          {member.last_name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {member.first_name} {member.last_name}
                        </p>
                        <p className="text-sm text-gray-600">{member.department}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {hasCheckedIn ? (
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Presente
                          </Badge>
                          {checkInRecord && (
                            <span className="text-xs text-gray-500">{formatDistance(checkInRecord.distance)}</span>
                          )}
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleCheckIn(member)}
                          disabled={!currentLocation}
                          variant={locationStatus?.isNearChurch ? "default" : "outline"}
                        >
                          <MapPin className="h-3 w-3 mr-1" />
                          Check-in
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Check-in Records */}
        {checkInRecords.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Registros de Presença
              </CardTitle>
              <CardDescription>{checkInRecords.length} membro(s) registrado(s)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {checkInRecords.map((record, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">
                          {record.member.first_name} {record.member.last_name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(record.timestamp).toLocaleTimeString("pt-BR")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        className={
                          isWithinChurchRadius(record.distance)
                            ? "bg-green-100 text-green-800"
                            : "bg-orange-100 text-orange-800"
                        }
                      >
                        {formatDistance(record.distance)}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        {isWithinChurchRadius(record.distance) ? "Na igreja" : "Fora do raio"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Como Usar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• Clique em "Obter Localização" para ativar o GPS</p>
              <p>• O sistema verifica se você está dentro do raio da igreja (100m)</p>
              <p>• Faça check-in dos membros presentes clicando no botão "Check-in"</p>
              <p>• Membros fora do raio da igreja serão marcados com aviso</p>
              <p>• Use para controle de presença em eventos e cultos</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DialogShell>
  )
}

export default GPSCheckInModal
