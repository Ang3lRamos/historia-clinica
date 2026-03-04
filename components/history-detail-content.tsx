"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, FileDown, Printer } from "lucide-react"
import { toast } from "sonner"

interface HistoryDetailContentProps {
  history: Record<string, unknown> & {
    patients: Record<string, unknown> | null
  }
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

function DataSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">{title}</h3>
      {children}
    </div>
  )
}

function DataRow({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="flex items-baseline gap-2 py-1">
      <span className="text-sm text-muted-foreground">{label}:</span>
      <span className="text-sm font-medium text-foreground">{value || "---"}</span>
    </div>
  )
}

function JsonCheckboxList({ data, labels }: { data: Record<string, unknown>; labels: Record<string, string> }) {
  const trueItems = Object.entries(labels).filter(([key]) => data[key] === true)
  if (trueItems.length === 0) return <span className="text-sm text-muted-foreground">Ninguno</span>
  return (
    <div className="flex flex-wrap gap-2">
      {trueItems.map(([key, label]) => (
        <Badge key={key} variant="outline" className="text-xs">{label}</Badge>
      ))}
    </div>
  )
}

// ------- PDF GENERATION HELPERS -------

type JsPDFType = InstanceType<typeof import("jspdf").jsPDF>

function pdfText(pdf: JsPDFType, text: string, x: number, y: number, opts?: { bold?: boolean; size?: number; color?: [number, number, number]; maxWidth?: number }) {
  const { bold = false, size = 9, color = [30, 30, 50], maxWidth } = opts || {}
  pdf.setFontSize(size)
  pdf.setTextColor(...color)
  pdf.setFont("helvetica", bold ? "bold" : "normal")
  if (maxWidth) {
    pdf.text(text, x, y, { maxWidth })
  } else {
    pdf.text(text, x, y)
  }
}

function pdfSectionTitle(pdf: JsPDFType, title: string, y: number): number {
  pdf.setDrawColor(60, 100, 180)
  pdf.setFillColor(235, 242, 255)
  pdf.roundedRect(10, y - 4, 190, 7, 1, 1, "F")
  pdfText(pdf, title.toUpperCase(), 14, y + 1, { bold: true, size: 9, color: [30, 60, 140] })
  return y + 10
}

function pdfLabelValue(pdf: JsPDFType, label: string, value: string | null | undefined, x: number, y: number, labelWidth = 30): number {
  pdfText(pdf, label + ":", x, y, { bold: true, size: 8, color: [100, 100, 120] })
  pdfText(pdf, value || "---", x + labelWidth, y, { size: 8 })
  return y
}

function pdfCheckPage(pdf: JsPDFType, y: number, needed = 25): number {
  if (y + needed > 280) {
    pdf.addPage()
    return 15
  }
  return y
}

function pdfTableRow(pdf: JsPDFType, cols: string[], colXs: number[], y: number, bold = false) {
  cols.forEach((col, i) => {
    pdfText(pdf, col, colXs[i], y, { size: 8, bold })
  })
}

// ------- END PDF HELPERS -------

export function HistoryDetailContent({ history }: HistoryDetailContentProps) {
  const patient = history.patients as Record<string, unknown> | null
  const av = (history.agudeza_visual || {}) as Record<string, unknown>
  const ap = (history.antecedentes_personales || {}) as Record<string, unknown>
  const af = (history.antecedentes_familiares || {}) as Record<string, unknown>
  const ao = (history.antecedentes_ocupacionales || {}) as Record<string, unknown>
  const refData = (history.refraccion || {}) as Record<string, unknown>
  const ton = (history.tonometria || {}) as Record<string, unknown>
  const tc = (history.test_complementarios || {}) as Record<string, unknown>

  const str = (v: unknown) => (v != null && v !== "" ? String(v) : "---")
  const boolLabels = (data: Record<string, unknown>, labels: Record<string, string>) =>
    Object.entries(labels).filter(([k]) => data[k] === true).map(([, l]) => l).join(", ") || "Ninguno"

  async function handleExportPDF() {
    toast.info("Generando PDF...")

    try {
      const { jsPDF } = await import("jspdf")
      const pdf = new jsPDF("p", "mm", "a4")
      let y = 15

      // ---- HEADER ----
      pdf.setFillColor(30, 60, 140)
      pdf.rect(0, 0, 210, 28, "F")
      pdfText(pdf, "HISTORIA CLINICA VISUAL", 14, 12, { bold: true, size: 16, color: [255, 255, 255] })
      pdfText(pdf, (history.tipo_examen as string) || "Visiometria Ocupacional", 14, 19, { size: 10, color: [180, 200, 255] })
      pdfText(pdf, `Fecha: ${new Date(history.fecha_examen as string).toLocaleDateString("es-CO")}`, 150, 12, { size: 9, color: [200, 220, 255] })
      const conceptoLabel = (history.concepto as string) || "Pendiente"
      pdfText(pdf, `Concepto: ${conceptoLabel}`, 150, 19, { bold: true, size: 9, color: [255, 255, 255] })
      y = 36

      // ---- PATIENT INFO ----
      y = pdfSectionTitle(pdf, "Datos del Paciente", y)
      if (patient) {
        pdfLabelValue(pdf, "Nombre", `${patient.nombre} ${patient.apellido}`, 14, y)
        pdfLabelValue(pdf, "Documento", `${patient.documento_tipo} ${patient.documento_numero}`, 110, y)
        y += 6
        pdfLabelValue(pdf, "Empresa", str(patient.empresa), 14, y)
        pdfLabelValue(pdf, "Cargo", str(patient.cargo), 110, y)
        y += 6
        pdfLabelValue(pdf, "EPS", str(patient.eps), 14, y)
        pdfLabelValue(pdf, "Ciudad", str(patient.ciudad), 110, y)
        y += 6
        pdfLabelValue(pdf, "Telefono", str(patient.telefono), 14, y)
        pdfLabelValue(pdf, "Email", str(patient.email), 110, y)
        y += 6
      }
      if (history.motivo_consulta) {
        pdfLabelValue(pdf, "Motivo", history.motivo_consulta as string, 14, y, 20)
        y += 6
      }
      y += 4

      // ---- ANTECEDENTES ----
      y = pdfCheckPage(pdf, y, 35)
      y = pdfSectionTitle(pdf, "Antecedentes", y)
      pdfText(pdf, "Personales:", 14, y, { bold: true, size: 8, color: [60, 60, 80] })
      pdfText(pdf, boolLabels(ap, {
        diabetes: "Diabetes", hipertension: "Hipertension", migranas: "Migranas",
        alergias: "Alergias", cirugias_oculares: "Cirugias oculares", usa_lentes: "Usa lentes"
      }), 40, y, { size: 8, maxWidth: 155 })
      y += 6
      if (ap.otros) { pdfLabelValue(pdf, "Otros", str(ap.otros), 14, y, 20); y += 6 }
      pdfText(pdf, "Familiares:", 14, y, { bold: true, size: 8, color: [60, 60, 80] })
      pdfText(pdf, boolLabels(af, {
        diabetes: "Diabetes", hipertension: "Hipertension", glaucoma: "Glaucoma",
        cataratas: "Cataratas", miopia: "Miopia"
      }), 40, y, { size: 8, maxWidth: 155 })
      y += 6
      pdfText(pdf, "Ocupacionales:", 14, y, { bold: true, size: 8, color: [60, 60, 80] })
      pdfText(pdf, boolLabels(ao, {
        exposicion_pantalla: "Pantalla/VDT", exposicion_quimicos: "Quimicos",
        exposicion_soldadura: "Soldadura", exposicion_polvo: "Polvo", usa_epp_visual: "Usa EPP"
      }), 46, y, { size: 8, maxWidth: 150 })
      y += 10

      // ---- AGUDEZA VISUAL ----
      y = pdfCheckPage(pdf, y, 50)
      y = pdfSectionTitle(pdf, "Agudeza Visual", y)
      const avCols = [14, 65, 100, 135, 170]
      pdfTableRow(pdf, ["", "OD", "OI", "AO", ""], avCols, y, true)
      y += 5
      const avRows = [
        ["SC Lejos", str(av.sc_od_lejos), str(av.sc_oi_lejos), str(av.sc_ao_lejos)],
        ["SC Cerca", str(av.sc_od_cerca), str(av.sc_oi_cerca), str(av.sc_ao_cerca)],
        ["CC Lejos", str(av.cc_od_lejos), str(av.cc_oi_lejos), str(av.cc_ao_lejos)],
        ["CC Cerca", str(av.cc_od_cerca), str(av.cc_oi_cerca), str(av.cc_ao_cerca)],
        ["PH", str(av.ph_od), str(av.ph_oi), "---"],
      ]
      for (const row of avRows) {
        pdf.setDrawColor(220, 220, 230)
        pdf.line(14, y - 3, 170, y - 3)
        pdfTableRow(pdf, row, avCols, y)
        y += 5
      }
      y += 5

      // ---- REFRACCION ----
      y = pdfCheckPage(pdf, y, 35)
      y = pdfSectionTitle(pdf, "Refraccion", y)
      const refCols = [14, 45, 75, 100, 125, 155]
      pdfTableRow(pdf, ["", "Esf", "Cil", "Eje", "ADD", "AV"], refCols, y, true)
      y += 5
      pdf.setDrawColor(220, 220, 230)
      pdf.line(14, y - 3, 185, y - 3)
      pdfTableRow(pdf, ["OD", str(refData.od_esfera), str(refData.od_cilindro), str(refData.od_eje), str(refData.od_add), str(refData.od_av)], refCols, y)
      y += 5
      pdf.line(14, y - 3, 185, y - 3)
      pdfTableRow(pdf, ["OI", str(refData.oi_esfera), str(refData.oi_cilindro), str(refData.oi_eje), str(refData.oi_add), str(refData.oi_av)], refCols, y)
      y += 5
      pdfLabelValue(pdf, "DP", str(refData.dp), 14, y + 3)
      y += 10

      // ---- TONOMETRIA ----
      y = pdfCheckPage(pdf, y, 25)
      y = pdfSectionTitle(pdf, "Tonometria", y)
      pdfLabelValue(pdf, "OD", ton.od_mmhg ? `${ton.od_mmhg} mmHg` : "---", 14, y, 15)
      pdfLabelValue(pdf, "OI", ton.oi_mmhg ? `${ton.oi_mmhg} mmHg` : "---", 70, y, 15)
      pdfLabelValue(pdf, "Metodo", str(ton.metodo), 130, y, 20)
      y += 10

      // ---- TEST COMPLEMENTARIOS ----
      y = pdfCheckPage(pdf, y, 20)
      y = pdfSectionTitle(pdf, "Test Complementarios", y)
      pdfLabelValue(pdf, "Ishihara", str(tc.ishihara), 14, y, 22)
      pdfLabelValue(pdf, "Estereopsis", str(tc.estereopsis), 110, y, 28)
      y += 10

      // ---- DIAGNOSTICO ----
      y = pdfCheckPage(pdf, y, 40)
      y = pdfSectionTitle(pdf, "Diagnostico y Conducta", y)
      pdfText(pdf, "Diagnostico:", 14, y, { bold: true, size: 8, color: [60, 60, 80] })
      y += 5
      pdfText(pdf, str(history.diagnostico), 14, y, { size: 8, maxWidth: 180 })
      y += Math.ceil(str(history.diagnostico).length / 90) * 4 + 4
      y = pdfCheckPage(pdf, y, 20)
      pdfText(pdf, "Conducta:", 14, y, { bold: true, size: 8, color: [60, 60, 80] })
      y += 5
      pdfText(pdf, str(history.conducta), 14, y, { size: 8, maxWidth: 180 })
      y += Math.ceil(str(history.conducta).length / 90) * 4 + 4
      if (history.observaciones) {
        y = pdfCheckPage(pdf, y, 15)
        pdfText(pdf, "Observaciones:", 14, y, { bold: true, size: 8, color: [60, 60, 80] })
        y += 5
        pdfText(pdf, str(history.observaciones), 14, y, { size: 8, maxWidth: 180 })
        y += Math.ceil(str(history.observaciones).length / 90) * 4 + 4
      }

      // ---- CONCEPTO ----
      y = pdfCheckPage(pdf, y, 15)
      pdf.setFillColor(235, 242, 255)
      pdf.roundedRect(10, y - 3, 190, 10, 1, 1, "F")
      pdfText(pdf, `CONCEPTO: ${conceptoLabel}`, 14, y + 3, { bold: true, size: 11, color: [30, 60, 140] })
      y += 16

      // ---- FIRMAS ----
      y = pdfCheckPage(pdf, y, 30)
      y = pdfSectionTitle(pdf, "Firmas", y)
      pdfLabelValue(pdf, "Profesional", str(history.profesional_nombre), 14, y, 28)
      pdfLabelValue(pdf, "Registro", str(history.profesional_registro), 110, y, 22)
      y += 12
      pdf.setDrawColor(150, 150, 170)
      pdf.line(14, y, 80, y)
      pdf.line(110, y, 176, y)
      y += 4
      pdfText(pdf, "Firma Profesional", 30, y, { size: 7, color: [120, 120, 140] })
      pdfText(pdf, "Firma Paciente", 128, y, { size: 7, color: [120, 120, 140] })

      // ---- FOOTER ----
      const pages = pdf.getNumberOfPages()
      for (let i = 1; i <= pages; i++) {
        pdf.setPage(i)
        pdf.setFillColor(240, 240, 245)
        pdf.rect(0, 287, 210, 10, "F")
        pdfText(pdf, `Pagina ${i} de ${pages}`, 95, 293, { size: 7, color: [140, 140, 160] })
        pdfText(pdf, "OptiClinic - Historia Clinica Visual", 14, 293, { size: 7, color: [140, 140, 160] })
      }

      const patientName = patient ? `${patient.nombre}_${patient.apellido}` : "paciente"
      pdf.save(`historia_clinica_${patientName}_${history.fecha_examen}.pdf`)
      toast.success("PDF descargado exitosamente")
    } catch (err) {
      console.error("PDF generation error:", err)
      toast.error("Error al generar el PDF")
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href={patient ? `/dashboard/pacientes/${patient.id}` : "/dashboard"}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Historia Clinica
            </h1>
            <p className="text-sm text-muted-foreground">
              {patient ? `${patient.nombre} ${patient.apellido}` : "Paciente"} -{" "}
              {new Date(history.fecha_examen as string).toLocaleDateString("es-CO")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
          <Button onClick={handleExportPDF}>
            <FileDown className="mr-2 h-4 w-4" />
            Exportar PDF
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-4">
        {/* Header Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg text-foreground">
                {(history.tipo_examen as string) || "Visiometria Ocupacional"}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Fecha: {new Date(history.fecha_examen as string).toLocaleDateString("es-CO")}
              </p>
            </div>
            {getConceptoBadge(history.concepto as string | null)}
          </CardHeader>
          <CardContent>
            {patient && (
              <div className="grid gap-2 md:grid-cols-4">
                <DataRow label="Nombre" value={`${patient.nombre} ${patient.apellido}`} />
                <DataRow label="Documento" value={`${patient.documento_tipo} ${patient.documento_numero}`} />
                <DataRow label="Empresa" value={patient.empresa as string} />
                <DataRow label="EPS" value={patient.eps as string} />
              </div>
            )}
            {history.motivo_consulta && (
              <div className="mt-4">
                <DataRow label="Motivo de consulta" value={history.motivo_consulta as string} />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Antecedentes */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-6 md:grid-cols-3">
              <DataSection title="Antecedentes Personales">
                <JsonCheckboxList
                  data={ap}
                  labels={{
                    diabetes: "Diabetes",
                    hipertension: "Hipertension",
                    migranas: "Migranas",
                    alergias: "Alergias",
                    cirugias_oculares: "Cirugias oculares",
                    usa_lentes: "Usa lentes",
                  }}
                />
                {ap.otros && <DataRow label="Otros" value={ap.otros as string} />}
              </DataSection>
              <DataSection title="Antecedentes Familiares">
                <JsonCheckboxList
                  data={af}
                  labels={{
                    diabetes: "Diabetes",
                    hipertension: "Hipertension",
                    glaucoma: "Glaucoma",
                    cataratas: "Cataratas",
                    miopia: "Miopia",
                  }}
                />
              </DataSection>
              <DataSection title="Antecedentes Ocupacionales">
                <DataRow label="Cargo" value={ao.cargo as string} />
                <DataRow label="Empresa" value={ao.empresa as string} />
                <JsonCheckboxList
                  data={ao}
                  labels={{
                    exposicion_pantalla: "Pantalla/VDT",
                    exposicion_quimicos: "Quimicos",
                    exposicion_soldadura: "Soldadura",
                    exposicion_polvo: "Polvo",
                    usa_epp_visual: "Usa EPP",
                  }}
                />
              </DataSection>
            </div>
          </CardContent>
        </Card>

        {/* Agudeza Visual */}
        <Card>
          <CardContent className="pt-6">
            <DataSection title="Agudeza Visual">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th className="pb-2 text-left text-xs text-muted-foreground"></th>
                      <th className="pb-2 text-center text-xs text-muted-foreground">OD</th>
                      <th className="pb-2 text-center text-xs text-muted-foreground">OI</th>
                      <th className="pb-2 text-center text-xs text-muted-foreground">AO</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-1 font-medium text-foreground">SC Lejos</td>
                      <td className="py-1 text-center text-foreground">{(av.sc_od_lejos as string) || "---"}</td>
                      <td className="py-1 text-center text-foreground">{(av.sc_oi_lejos as string) || "---"}</td>
                      <td className="py-1 text-center text-foreground">{(av.sc_ao_lejos as string) || "---"}</td>
                    </tr>
                    <tr>
                      <td className="py-1 font-medium text-foreground">SC Cerca</td>
                      <td className="py-1 text-center text-foreground">{(av.sc_od_cerca as string) || "---"}</td>
                      <td className="py-1 text-center text-foreground">{(av.sc_oi_cerca as string) || "---"}</td>
                      <td className="py-1 text-center text-foreground">{(av.sc_ao_cerca as string) || "---"}</td>
                    </tr>
                    <tr>
                      <td className="py-1 font-medium text-foreground">CC Lejos</td>
                      <td className="py-1 text-center text-foreground">{(av.cc_od_lejos as string) || "---"}</td>
                      <td className="py-1 text-center text-foreground">{(av.cc_oi_lejos as string) || "---"}</td>
                      <td className="py-1 text-center text-foreground">{(av.cc_ao_lejos as string) || "---"}</td>
                    </tr>
                    <tr>
                      <td className="py-1 font-medium text-foreground">CC Cerca</td>
                      <td className="py-1 text-center text-foreground">{(av.cc_od_cerca as string) || "---"}</td>
                      <td className="py-1 text-center text-foreground">{(av.cc_oi_cerca as string) || "---"}</td>
                      <td className="py-1 text-center text-foreground">{(av.cc_ao_cerca as string) || "---"}</td>
                    </tr>
                    <tr>
                      <td className="py-1 font-medium text-foreground">PH</td>
                      <td className="py-1 text-center text-foreground">{(av.ph_od as string) || "---"}</td>
                      <td className="py-1 text-center text-foreground">{(av.ph_oi as string) || "---"}</td>
                      <td className="py-1 text-center text-foreground">---</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </DataSection>
          </CardContent>
        </Card>

        {/* Refraccion & Tonometria */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardContent className="pt-6">
              <DataSection title="Refraccion">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        <th className="pb-2 text-left text-xs text-muted-foreground"></th>
                        <th className="pb-2 text-center text-xs text-muted-foreground">Esf</th>
                        <th className="pb-2 text-center text-xs text-muted-foreground">Cil</th>
                        <th className="pb-2 text-center text-xs text-muted-foreground">Eje</th>
                        <th className="pb-2 text-center text-xs text-muted-foreground">ADD</th>
                        <th className="pb-2 text-center text-xs text-muted-foreground">AV</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-1 font-medium text-foreground">OD</td>
                        <td className="py-1 text-center text-foreground">{(refData.od_esfera as string) || "---"}</td>
                        <td className="py-1 text-center text-foreground">{(refData.od_cilindro as string) || "---"}</td>
                        <td className="py-1 text-center text-foreground">{(refData.od_eje as string) || "---"}</td>
                        <td className="py-1 text-center text-foreground">{(refData.od_add as string) || "---"}</td>
                        <td className="py-1 text-center text-foreground">{(refData.od_av as string) || "---"}</td>
                      </tr>
                      <tr>
                        <td className="py-1 font-medium text-foreground">OI</td>
                        <td className="py-1 text-center text-foreground">{(refData.oi_esfera as string) || "---"}</td>
                        <td className="py-1 text-center text-foreground">{(refData.oi_cilindro as string) || "---"}</td>
                        <td className="py-1 text-center text-foreground">{(refData.oi_eje as string) || "---"}</td>
                        <td className="py-1 text-center text-foreground">{(refData.oi_add as string) || "---"}</td>
                        <td className="py-1 text-center text-foreground">{(refData.oi_av as string) || "---"}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <DataRow label="DP" value={refData.dp as string} />
              </DataSection>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <DataSection title="Tonometria">
                <div className="grid gap-2">
                  <DataRow label="OD" value={ton.od_mmhg ? `${ton.od_mmhg} mmHg` : null} />
                  <DataRow label="OI" value={ton.oi_mmhg ? `${ton.oi_mmhg} mmHg` : null} />
                  <DataRow label="Metodo" value={ton.metodo as string} />
                </div>
              </DataSection>
              <Separator className="my-4" />
              <DataSection title="Test Complementarios">
                <DataRow label="Ishihara" value={tc.ishihara as string} />
                <DataRow label="Estereopsis" value={tc.estereopsis as string} />
              </DataSection>
            </CardContent>
          </Card>
        </div>

        {/* Diagnostico */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <DataSection title="Diagnostico">
                <p className="text-sm text-foreground">{(history.diagnostico as string) || "---"}</p>
              </DataSection>
              <DataSection title="Conducta">
                <p className="text-sm text-foreground">{(history.conducta as string) || "---"}</p>
              </DataSection>
              {history.observaciones && (
                <DataSection title="Observaciones">
                  <p className="text-sm text-foreground">{history.observaciones as string}</p>
                </DataSection>
              )}
              <DataSection title="Concepto">
                {getConceptoBadge(history.concepto as string | null)}
              </DataSection>
            </div>
          </CardContent>
        </Card>

        {/* Firmas */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <DataSection title="Profesional">
                <DataRow label="Nombre" value={history.profesional_nombre as string} />
                <DataRow label="Registro" value={history.profesional_registro as string} />
                {history.firma_profesional_url && (
                  <img
                    src={history.firma_profesional_url as string}
                    alt="Firma del profesional"
                    className="mt-2 h-20 w-40 rounded-lg border border-border object-contain"
                    crossOrigin="anonymous"
                  />
                )}
              </DataSection>
              <DataSection title="Paciente">
                {history.firma_paciente_url && (
                  <img
                    src={history.firma_paciente_url as string}
                    alt="Firma del paciente"
                    className="mt-2 h-20 w-40 rounded-lg border border-border object-contain"
                    crossOrigin="anonymous"
                  />
                )}
              </DataSection>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
