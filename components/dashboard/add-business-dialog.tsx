"use client"

import { useState } from "react"
import { useFormStatus } from "react-dom"
import { Plus } from "lucide-react"
import { toast } from "sonner"
import { createBusiness } from "@/app/actions/business"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "A guardar..." : "Guardar empresa"}
    </Button>
  )
}

export function AddBusinessDialog() {
  const [open, setOpen] = useState(false)

  async function handleSubmit(formData: FormData) {
    const result = await createBusiness(formData)
    if (result.success) {
      toast.success("Empresa adicionada com sucesso.")
      setOpen(false)
    } else {
      toast.error(result.error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Adicionar empresa
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar empresa</DialogTitle>
          <DialogDescription>
            Associe um local do Google Business Profile para começar a gerir as avaliações.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium">
              Nome da empresa
            </label>
            <Input id="name" name="name" placeholder="Ex.: Café Central" required />
          </div>
          <div className="grid gap-2">
            <label htmlFor="googleLocationId" className="text-sm font-medium">
              ID do Local Google
            </label>
            <Input
              id="googleLocationId"
              name="googleLocationId"
              placeholder="Ex.: locations/1234567890"
              required
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="address" className="text-sm font-medium">
              Morada <span className="text-muted-foreground font-normal">(opcional)</span>
            </label>
            <Input id="address" name="address" placeholder="Rua, número, cidade" />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DialogClose>
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
