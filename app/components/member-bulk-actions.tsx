"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { AlertTriangle, Users, Download, Trash2, UserCheck, UserX } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getDb } from "@/lib/database"
import { onAction } from "@/lib/actions" // Declare or import the onAction variable

interface MemberBulkActionsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedMembers: string[]
}

export function MemberBulkActions({ open, onOpenChange, selectedMembers }: MemberBulkActionsProps) {
  const [selectedAction, setSelectedAction] = useState("")
  const [isConfirming, setIsConfirming] = useState(false)
  const db = getDb()

  const handleSubmit = () => {
    if (!selectedAction) return

    if (selectedAction === "delete") {
      setIsConfirming(true)
      return
    }

    onAction(selectedAction, selectedMembers)
    setSelectedAction("")
    setIsConfirming(false)
  }

  const handleConfirmDelete = () => {
    const remaining = db.select("members").filter((m: any) => !selectedMembers.includes(m.id))
    // reset table
    ;(db as any).store.set("members", remaining)
    setSelectedAction("")
    setIsConfirming(false)
    onOpenChange(false)
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case "activate":
        return <UserCheck className="h-4 w-4" />
      case "deactivate":
        return <UserX className="h-4 w-4" />
      case "export":
        return <Download className="h-4 w-4" />
      case "delete":
        return <Trash2 className="h-4 w-4" />
      default:
        return <Users className="h-4 w-4" />
    }
  }

  const getActionDescription = (action: string) => {
    switch (action) {
      case "activate":
        return "Ativar os membros selecionados"
      case "deactivate":
        return "Desativar os membros selecionados"
      case "export":
        return "Exportar dados dos membros selecionados"
      case "delete":
        return "Remover permanentemente os membros selecionados"
      default:
        return ""
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Ações em Massa
          </DialogTitle>
          <DialogDescription>Aplicar ação para {selectedMembers.length} membro(s) selecionado(s)</DialogDescription>
        </DialogHeader>

        {!isConfirming ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="action">Selecionar Ação</Label>
              <Select value={selectedAction} onValueChange={setSelectedAction}>
                <SelectTrigger>
                  <SelectValue placeholder="Escolha uma ação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activate">
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4" />
                      Ativar Membros
                    </div>
                  </SelectItem>
                  <SelectItem value="deactivate">
                    <div className="flex items-center gap-2">
                      <UserX className="h-4 w-4" />
                      Desativar Membros
                    </div>
                  </SelectItem>
                  <SelectItem value="export">
                    <div className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Exportar Dados
                    </div>
                  </SelectItem>
                  <SelectItem value="delete">
                    <div className="flex items-center gap-2">
                      <Trash2 className="h-4 w-4" />
                      Remover Membros
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedAction && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  {getActionIcon(selectedAction)}
                  <span className="font-medium">Ação Selecionada</span>
                </div>
                <p className="text-sm text-gray-600">{getActionDescription(selectedAction)}</p>
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSubmit} disabled={!selectedAction}>
                Aplicar Ação
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Atenção!</strong> Esta ação não pode ser desfeita. Tem certeza que deseja remover
                permanentemente {selectedMembers.length} membro(s)?
              </AlertDescription>
            </Alert>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsConfirming(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleConfirmDelete}>
                Confirmar Remoção
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
