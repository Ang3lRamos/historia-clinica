"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, UserPlus, Eye, Users } from "lucide-react"
import { toast } from "sonner"

interface Patient {
  id: string
  nombre: string
  apellido: string
  documento_tipo: string
  documento_numero: string
  fecha_nacimiento: string | null
  sexo: string | null
  telefono: string | null
  email: string | null
  empresa: string | null
  eps: string | null
  created_at: string
}

interface PatientsListContentProps {
  patients: Patient[]
}

export function PatientsListContent({ patients: initialPatients }: PatientsListContentProps) {
  const [patients, setPatients] = useState(initialPatients)
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  const filtered = patients.filter((p) => {
    const q = search.toLowerCase()
    return (
      p.nombre.toLowerCase().includes(q) ||
      p.apellido.toLowerCase().includes(q) ||
      p.documento_numero.includes(q) ||
      (p.empresa && p.empresa.toLowerCase().includes(q))
    )
  })

  async function handleCreatePatient(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)

    const formData = new FormData(e.currentTarget)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      toast.error("Sesion expirada")
      setSaving(false)
      return
    }

    const { data, error } = await supabase
      .from("patients")
      .insert({
        user_id: user.id,
        nombre: formData.get("nombre") as string,
        apellido: formData.get("apellido") as string,
        documento_tipo: formData.get("documento_tipo") as string,
        documento_numero: formData.get("documento_numero") as string,
        fecha_nacimiento: (formData.get("fecha_nacimiento") as string) || null,
        sexo: (formData.get("sexo") as string) || null,
        telefono: (formData.get("telefono") as string) || null,
        email: (formData.get("email") as string) || null,
        direccion: (formData.get("direccion") as string) || null,
        ciudad: (formData.get("ciudad") as string) || null,
        empresa: (formData.get("empresa") as string) || null,
        cargo: (formData.get("cargo") as string) || null,
        eps: (formData.get("eps") as string) || null,
      })
      .select()
      .single()

    if (error) {
      toast.error("Error al crear paciente: " + error.message)
      setSaving(false)
      return
    }

    setPatients([data, ...patients])
    setDialogOpen(false)
    setSaving(false)
    toast.success("Paciente creado exitosamente")
    router.refresh()
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Pacientes</h1>
          <p className="text-sm text-muted-foreground">
            Gestione los pacientes registrados en el sistema
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Nuevo Paciente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-foreground">Registrar Nuevo Paciente</DialogTitle>
              <DialogDescription>Complete los datos del paciente</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreatePatient} className="flex flex-col gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="nombre">Nombre *</Label>
                  <Input id="nombre" name="nombre" required placeholder="Nombre" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="apellido">Apellido *</Label>
                  <Input id="apellido" name="apellido" required placeholder="Apellido" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="documento_tipo">Tipo Documento</Label>
                  <Select name="documento_tipo" defaultValue="CC">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CC">Cedula de Ciudadania</SelectItem>
                      <SelectItem value="TI">Tarjeta de Identidad</SelectItem>
                      <SelectItem value="CE">Cedula de Extranjeria</SelectItem>
                      <SelectItem value="PA">Pasaporte</SelectItem>
                      <SelectItem value="RC">Registro Civil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="documento_numero">Numero Documento *</Label>
                  <Input id="documento_numero" name="documento_numero" required placeholder="123456789" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="fecha_nacimiento">Fecha de Nacimiento</Label>
                  <Input id="fecha_nacimiento" name="fecha_nacimiento" type="date" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="sexo">Sexo</Label>
                  <Select name="sexo">
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Masculino</SelectItem>
                      <SelectItem value="F">Femenino</SelectItem>
                      <SelectItem value="Otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="telefono">Telefono</Label>
                  <Input id="telefono" name="telefono" placeholder="3001234567" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email">Correo Electronico</Label>
                  <Input id="email" name="email" type="email" placeholder="paciente@correo.com" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="direccion">Direccion</Label>
                  <Input id="direccion" name="direccion" placeholder="Calle 123 #45-67" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="ciudad">Ciudad</Label>
                  <Input id="ciudad" name="ciudad" placeholder="Bogota" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="empresa">Empresa</Label>
                  <Input id="empresa" name="empresa" placeholder="Empresa S.A.S" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="cargo">Cargo</Label>
                  <Input id="cargo" name="cargo" placeholder="Operario" />
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <Label htmlFor="eps">EPS</Label>
                  <Input id="eps" name="eps" placeholder="EPS Sura" />
                </div>
              </div>
              <Button type="submit" disabled={saving} className="mt-2">
                {saving ? "Guardando..." : "Registrar Paciente"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-foreground">Lista de Pacientes</CardTitle>
              <CardDescription>{patients.length} pacientes registrados</CardDescription>
            </div>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, documento, empresa..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                {patients.length === 0
                  ? "No hay pacientes registrados. Agregue el primero."
                  : "No se encontraron pacientes con esa busqueda."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Documento</TableHead>
                    <TableHead className="hidden md:table-cell">Empresa</TableHead>
                    <TableHead className="hidden md:table-cell">EPS</TableHead>
                    <TableHead className="hidden lg:table-cell">Telefono</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium text-foreground">
                        {patient.nombre} {patient.apellido}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        <Badge variant="outline" className="font-mono text-xs">
                          {patient.documento_tipo}
                        </Badge>{" "}
                        {patient.documento_numero}
                      </TableCell>
                      <TableCell className="hidden text-muted-foreground md:table-cell">
                        {patient.empresa || "---"}
                      </TableCell>
                      <TableCell className="hidden text-muted-foreground md:table-cell">
                        {patient.eps || "---"}
                      </TableCell>
                      <TableCell className="hidden text-muted-foreground lg:table-cell">
                        {patient.telefono || "---"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/dashboard/pacientes/${patient.id}`}>
                            <Eye className="mr-1 h-4 w-4" />
                            Ver
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
