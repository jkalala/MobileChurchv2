import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

interface DepartmentSelectModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (department: string) => void
}

export function DepartmentSelectModal({ open, onOpenChange, onSelect }: DepartmentSelectModalProps) {
  const [departments, setDepartments] = useState<{ id: string; name: string }[]>([])
  const [selected, setSelected] = useState("")

  useEffect(() => {
    if (open) {
      fetch("/api/departments")
        .then(res => res.json())
        .then(data => setDepartments(data))
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Department</DialogTitle>
        </DialogHeader>
        <Select value={selected} onValueChange={setSelected}>
          <SelectTrigger>
            <SelectValue placeholder="Select department" />
          </SelectTrigger>
          <SelectContent>
            {departments.map(dep => (
              <SelectItem key={dep.id} value={dep.name}>{dep.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={() => { onSelect(selected); onOpenChange(false); }} disabled={!selected} className="mt-4 w-full">
          Assign
        </Button>
      </DialogContent>
    </Dialog>
  )
} 