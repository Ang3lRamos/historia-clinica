"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Users, FileText, CalendarDays, FilePlus, ArrowRight } from "lucide-react"

interface RecentHistory {
  id: string
  fecha_examen: string
  tipo_examen: string | null
  concepto: string | null
  profesional_nombre: string | null
  created_at: string
  patients: {
    id: string
    nombre: string
    apellido: string
    documento_numero: string
  } | null
}

interface DashboardContentProps {
  userName: string
  totalPatients: number
  totalHistories: number
  thisMonthHistories: number
  recentHistories: RecentHistory[]
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

export function DashboardContent({
  userName,
  totalPatients,
  totalHistories,
  thisMonthHistories,
  recentHistories,
}: DashboardContentProps) {
  const stats = [
    {
      title: "Total Pacientes",
      value: totalPatients,
      icon: Users,
      description: "Registrados en el sistema",
    },
    {
      title: "Historias Clinicas",
      value: totalHistories,
      icon: FileText,
      description: "Total realizadas",
    },
    {
      title: "Este Mes",
      value: thisMonthHistories,
      icon: CalendarDays,
      description: "Historias del mes actual",
    },
  ]

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      {/* Welcome */}
      <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">
            {"Bienvenido, " + userName}
          </h1>
          <p className="text-sm text-muted-foreground">
            Resumen de su actividad clinica
          </p>
        </div>
        <Button asChild className="mt-3 md:mt-0">
          <Link href="/dashboard/historias/nueva">
            <FilePlus className="mr-2 h-4 w-4" />
            Nueva Historia Clinica
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stat.value}</div>
              <p className="mt-1 text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Histories */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-foreground">Historias Recientes</CardTitle>
            <CardDescription>Ultimas historias clinicas realizadas</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/pacientes">
              Ver todas
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentHistories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                No hay historias clinicas aun. Cree la primera haciendo clic en &quot;Nueva Historia Clinica&quot;.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Documento</TableHead>
                  <TableHead>Fecha Examen</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Concepto</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentHistories.map((history) => (
                  <TableRow key={history.id}>
                    <TableCell className="font-medium text-foreground">
                      <Link
                        href={`/dashboard/historias/${history.id}`}
                        className="hover:text-primary hover:underline"
                      >
                        {history.patients
                          ? `${history.patients.nombre} ${history.patients.apellido}`
                          : "---"}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {history.patients?.documento_numero || "---"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(history.fecha_examen).toLocaleDateString("es-CO")}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {history.tipo_examen || "---"}
                    </TableCell>
                    <TableCell>{getConceptoBadge(history.concepto)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
