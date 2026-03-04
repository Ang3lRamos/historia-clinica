"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, FilePlus, FileText, User, Building2, Phone, Mail, MapPin, Calendar } from "lucide-react"

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
  direccion: string | null
  ciudad: string | null
  empresa: string | null
  cargo: string | null
  eps: string | null
  created_at: string
}

interface ClinicalHistory {
  id: string
  fecha_examen: string
  tipo_examen: string | null
  concepto: string | null
  diagnostico: string | null
  profesional_nombre: string | null
  created_at: string
}

interface PatientDetailContentProps {
  patient: Patient
  histories: ClinicalHistory[]
}

function getConceptoBadge(concepto: string | null) {
  switch (concepto) {
    case "Apto":
      return <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-100">Apto</Badge>
    case "Apto con restricciones":
      return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 hover:bg-amber-100">Con restricciones</Badge>
    case "No apto":
      return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-100">No apto</Badge>
    case "Aplazado":
      return <Badge className="bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400 hover:bg-slate-100">Aplazado</Badge>
    default:
      return <Badge variant="secondary">Pendiente</Badge>
  }
}

function calculateAge(birthDate: string | null) {
  if (!birthDate) return null
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
}

function InfoItem({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | null }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">{value || "---"}</p>
      </div>
    </div>
  )
}

export function PatientDetailContent({ patient, histories }: PatientDetailContentProps) {
  const age = calculateAge(patient.fecha_nacimiento)

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/pacientes">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {patient.nombre} {patient.apellido}
            </h1>
            <p className="text-sm text-muted-foreground">
              {patient.documento_tipo} {patient.documento_numero}
              {age !== null && ` - ${age} anios`}
            </p>
          </div>
        </div>
        <Button asChild>
          <Link href={`/dashboard/historias/nueva?paciente=${patient.id}`}>
            <FilePlus className="mr-2 h-4 w-4" />
            Nueva Historia
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Patient Info */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <User className="h-4 w-4" />
              Datos del Paciente
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <InfoItem icon={User} label="Sexo" value={patient.sexo === "M" ? "Masculino" : patient.sexo === "F" ? "Femenino" : patient.sexo} />
            <InfoItem icon={Calendar} label="Fecha de Nacimiento" value={patient.fecha_nacimiento ? new Date(patient.fecha_nacimiento).toLocaleDateString("es-CO") : null} />
            <Separator />
            <InfoItem icon={Phone} label="Telefono" value={patient.telefono} />
            <InfoItem icon={Mail} label="Correo" value={patient.email} />
            <InfoItem icon={MapPin} label="Direccion" value={patient.direccion} />
            <InfoItem icon={MapPin} label="Ciudad" value={patient.ciudad} />
            <Separator />
            <InfoItem icon={Building2} label="Empresa" value={patient.empresa} />
            <InfoItem icon={User} label="Cargo" value={patient.cargo} />
            <InfoItem icon={Building2} label="EPS" value={patient.eps} />
          </CardContent>
        </Card>

        {/* Histories */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <FileText className="h-4 w-4" />
              Historias Clinicas
            </CardTitle>
            <CardDescription>{histories.length} registros</CardDescription>
          </CardHeader>
          <CardContent>
            {histories.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="mb-4 h-12 w-12 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">
                  No hay historias clinicas para este paciente.
                </p>
                <Button asChild className="mt-4" variant="outline">
                  <Link href={`/dashboard/historias/nueva?paciente=${patient.id}`}>
                    Crear primera historia
                  </Link>
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Diagnostico</TableHead>
                    <TableHead>Concepto</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {histories.map((h) => (
                    <TableRow key={h.id}>
                      <TableCell className="text-foreground">
                        {new Date(h.fecha_examen).toLocaleDateString("es-CO")}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {h.tipo_examen || "---"}
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-muted-foreground">
                        {h.diagnostico || "---"}
                      </TableCell>
                      <TableCell>{getConceptoBadge(h.concepto)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/dashboard/historias/${h.id}`}>
                            Ver
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
