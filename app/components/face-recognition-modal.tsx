"use client"

import { useState } from "react"
import { DialogShell } from "./_shared/dialog-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Camera, Scan, Users, CheckCircle, AlertCircle, Play, Square } from "lucide-react"
import type { Member } from "@/lib/database"

interface FaceRecognitionModalProps {
  members: Member[]
  onClose?: () => void
}

export function FaceRecognitionModal({ members, onClose }: FaceRecognitionModalProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [recognizedMembers, setRecognizedMembers] = useState<Member[]>([])
  const [scanResults, setScanResults] = useState<{
    total: number
    recognized: number
    unrecognized: number
  }>({
    total: 0,
    recognized: 0,
    unrecognized: 0,
  })

  const handleStartScan = () => {
    setIsScanning(true)
    // Simulate face recognition scanning
    setTimeout(() => {
      const mockRecognized = members.slice(0, Math.floor(Math.random() * 5) + 1)
      setRecognizedMembers(mockRecognized)
      setScanResults({
        total: mockRecognized.length + 2,
        recognized: mockRecognized.length,
        unrecognized: 2,
      })
      setIsScanning(false)
    }, 3000)
  }

  const handleStopScan = () => {
    setIsScanning(false)
  }

  const handleReset = () => {
    setRecognizedMembers([])
    setScanResults({ total: 0, recognized: 0, unrecognized: 0 })
  }

  return (
    <DialogShell isOpen={true} onClose={onClose || (() => {})} title="Face Recognition">
      <div className="flex flex-col items-center gap-4">
        <Camera className="h-16 w-16 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Simulated face scan…</p>
        <Button disabled>Scan (demo)</Button>
      </div>

      <div className="space-y-6 mt-8">
        {/* Camera Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scan className="h-5 w-5" />
              Camera de Reconhecimento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                {isScanning ? (
                  <div className="text-center text-white">
                    <div className="animate-pulse">
                      <Camera className="h-16 w-16 mx-auto mb-4" />
                      <p className="text-lg font-medium">Escaneando rostos...</p>
                      <p className="text-sm opacity-75">Aguarde enquanto identificamos os membros</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-400">
                    <Camera className="h-16 w-16 mx-auto mb-4" />
                    <p className="text-lg font-medium">Câmera Inativa</p>
                    <p className="text-sm">Clique em "Iniciar Escaneamento" para começar</p>
                  </div>
                )}
              </div>

              {/* Scanning overlay */}
              {isScanning && (
                <div className="absolute inset-0 border-4 border-blue-500 rounded-lg animate-pulse">
                  <div className="absolute top-4 left-4 right-4 h-1 bg-blue-500 animate-pulse"></div>
                  <div className="absolute bottom-4 left-4 right-4 h-1 bg-blue-500 animate-pulse"></div>
                </div>
              )}
            </div>

            <div className="flex justify-center gap-2 mt-4">
              {!isScanning ? (
                <Button onClick={handleStartScan} className="flex items-center gap-2">
                  <Play className="h-4 w-4" />
                  Iniciar Escaneamento
                </Button>
              ) : (
                <Button onClick={handleStopScan} variant="destructive" className="flex items-center gap-2">
                  <Square className="h-4 w-4" />
                  Parar Escaneamento
                </Button>
              )}
              {recognizedMembers.length > 0 && (
                <Button onClick={handleReset} variant="outline">
                  Limpar Resultados
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Scan Results */}
        {scanResults.total > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Resultados do Escaneamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{scanResults.total}</div>
                  <div className="text-sm text-gray-600">Total Detectado</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{scanResults.recognized}</div>
                  <div className="text-sm text-gray-600">Reconhecidos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{scanResults.unrecognized}</div>
                  <div className="text-sm text-gray-600">Não Reconhecidos</div>
                </div>
              </div>

              {recognizedMembers.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium">Membros Identificados:</h4>
                  {recognizedMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium">
                            {member.first_name} {member.last_name}
                          </p>
                          <p className="text-sm text-gray-600">{member.department}</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Confirmado</Badge>
                    </div>
                  ))}

                  {scanResults.unrecognized > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Pessoas Não Identificadas:</h4>
                      {Array.from({ length: scanResults.unrecognized }).map((_, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <AlertCircle className="h-5 w-5 text-orange-600" />
                            <div>
                              <p className="font-medium">Pessoa Desconhecida #{index + 1}</p>
                              <p className="text-sm text-gray-600">Não encontrada no banco de dados</p>
                            </div>
                          </div>
                          <Badge className="bg-orange-100 text-orange-800">Visitante</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
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
              <p>• Posicione a câmera de forma que os rostos fiquem claramente visíveis</p>
              <p>• Certifique-se de que há iluminação adequada</p>
              <p>• O sistema identificará automaticamente membros cadastrados</p>
              <p>• Pessoas não reconhecidas serão marcadas como visitantes</p>
              <p>• Use os resultados para registrar presença automaticamente</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DialogShell>
  )
}

export default FaceRecognitionModal
