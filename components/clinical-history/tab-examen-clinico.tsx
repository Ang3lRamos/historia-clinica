"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import type { ClinicalFormData } from "./clinical-history-form"

interface TabExamenClinicoProps {
  formData: ClinicalFormData
  updateNestedData: (key: keyof ClinicalFormData, field: string, value: unknown) => void
}

const normalAbnormal = ["Normal", "Anormal"]

function ExternalExamRow({
  label,
  dataKey,
  fieldPrefix,
  data,
  updateNestedData,
}: {
  label: string
  dataKey: keyof ClinicalFormData
  fieldPrefix: string
  data: Record<string, unknown>
  updateNestedData: (key: keyof ClinicalFormData, field: string, value: unknown) => void
}) {
  return (
    <tr>
      <td className="whitespace-nowrap py-2 pr-4 text-sm font-medium text-foreground">{label}</td>
      <td className="px-1 py-2">
        <Select
          value={(data[`${fieldPrefix}_od`] as string) || "Normal"}
          onValueChange={(v) => updateNestedData(dataKey, `${fieldPrefix}_od`, v)}
        >
          <SelectTrigger className="h-8 w-28 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {normalAbnormal.map((o) => (
              <SelectItem key={o} value={o}>{o}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </td>
      <td className="px-1 py-2">
        <Select
          value={(data[`${fieldPrefix}_oi`] as string) || "Normal"}
          onValueChange={(v) => updateNestedData(dataKey, `${fieldPrefix}_oi`, v)}
        >
          <SelectTrigger className="h-8 w-28 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {normalAbnormal.map((o) => (
              <SelectItem key={o} value={o}>{o}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </td>
    </tr>
  )
}

export function TabExamenClinico({ formData, updateNestedData }: TabExamenClinicoProps) {
  const ee = formData.examen_externo as Record<string, unknown>
  const ker = formData.queratometria as Record<string, unknown>
  const oft = formData.oftalmoscopia as Record<string, unknown>
  const ref = formData.refraccion as Record<string, unknown>
  const lens = formData.lensometria as Record<string, unknown>
  const ton = formData.tonometria as Record<string, unknown>
  const tc = formData.test_complementarios as Record<string, unknown>

  return (
    <div className="flex flex-col gap-8">
      {/* Examen Externo */}
      <div>
        <h3 className="mb-4 text-base font-semibold text-foreground">Examen Externo</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="pb-2 text-left text-xs font-medium text-muted-foreground"></th>
                <th className="pb-2 text-left text-xs font-medium text-muted-foreground">OD (Derecho)</th>
                <th className="pb-2 text-left text-xs font-medium text-muted-foreground">OI (Izquierdo)</th>
              </tr>
            </thead>
            <tbody>
              <ExternalExamRow label="Parpados" dataKey="examen_externo" fieldPrefix="parpados" data={ee} updateNestedData={updateNestedData} />
              <ExternalExamRow label="Conjuntiva" dataKey="examen_externo" fieldPrefix="conjuntiva" data={ee} updateNestedData={updateNestedData} />
              <ExternalExamRow label="Cornea" dataKey="examen_externo" fieldPrefix="cornea" data={ee} updateNestedData={updateNestedData} />
              <ExternalExamRow label="Iris" dataKey="examen_externo" fieldPrefix="iris" data={ee} updateNestedData={updateNestedData} />
              <ExternalExamRow label="Pupila" dataKey="examen_externo" fieldPrefix="pupila" data={ee} updateNestedData={updateNestedData} />
              <ExternalExamRow label="Cristalino" dataKey="examen_externo" fieldPrefix="cristalino" data={ee} updateNestedData={updateNestedData} />
            </tbody>
          </table>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="flex flex-col gap-2">
            <Label>Motilidad</Label>
            <Select
              value={(ee.motilidad as string) || "Normal"}
              onValueChange={(v) => updateNestedData("examen_externo", "motilidad", v)}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {normalAbnormal.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Cover Test</Label>
            <Select
              value={(ee.cover_test as string) || "Normal"}
              onValueChange={(v) => updateNestedData("examen_externo", "cover_test", v)}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {normalAbnormal.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label>PPC (cm)</Label>
            <Input
              value={(ee.ppc as string) || ""}
              onChange={(e) => updateNestedData("examen_externo", "ppc", e.target.value)}
              placeholder="8 cm"
            />
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-2">
          <Label>Observaciones examen externo</Label>
          <Textarea
            value={(ee.observaciones as string) || ""}
            onChange={(e) => updateNestedData("examen_externo", "observaciones", e.target.value)}
            rows={2}
          />
        </div>
      </div>

      <Separator />

      {/* Refraccion */}
      <div>
        <h3 className="mb-4 text-base font-semibold text-foreground">Refraccion</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="pb-2 text-left text-xs font-medium text-muted-foreground"></th>
                <th className="pb-2 text-center text-xs font-medium text-muted-foreground">Esfera</th>
                <th className="pb-2 text-center text-xs font-medium text-muted-foreground">Cilindro</th>
                <th className="pb-2 text-center text-xs font-medium text-muted-foreground">Eje</th>
                <th className="pb-2 text-center text-xs font-medium text-muted-foreground">ADD</th>
                <th className="pb-2 text-center text-xs font-medium text-muted-foreground">AV</th>
              </tr>
            </thead>
            <tbody>
              {(["od", "oi"] as const).map((eye) => (
                <tr key={eye}>
                  <td className="py-2 pr-4 text-sm font-medium text-foreground">{eye === "od" ? "OD" : "OI"}</td>
                  {["esfera", "cilindro", "eje", "add", "av"].map((f) => (
                    <td key={f} className="px-1 py-2">
                      <Input
                        className="h-8 w-20 text-center text-sm"
                        value={(ref[`${eye}_${f}`] as string) || ""}
                        onChange={(e) => updateNestedData("refraccion", `${eye}_${f}`, e.target.value)}
                        placeholder={f === "eje" ? "0-180" : f === "av" ? "20/" : "+/-"}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label>DP (mm)</Label>
            <Input
              value={(ref.dp as string) || ""}
              onChange={(e) => updateNestedData("refraccion", "dp", e.target.value)}
              placeholder="64"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Tipo de lente recomendado</Label>
            <Input
              value={(ref.tipo_lente as string) || ""}
              onChange={(e) => updateNestedData("refraccion", "tipo_lente", e.target.value)}
              placeholder="Monofocal, bifocal, progresivo..."
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Queratometria */}
      <div>
        <h3 className="mb-4 text-base font-semibold text-foreground">Queratometria</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="pb-2 text-left text-xs font-medium text-muted-foreground"></th>
                <th className="pb-2 text-center text-xs font-medium text-muted-foreground">K1</th>
                <th className="pb-2 text-center text-xs font-medium text-muted-foreground">K2</th>
                <th className="pb-2 text-center text-xs font-medium text-muted-foreground">Eje</th>
              </tr>
            </thead>
            <tbody>
              {(["od", "oi"] as const).map((eye) => (
                <tr key={eye}>
                  <td className="py-2 pr-4 text-sm font-medium text-foreground">{eye === "od" ? "OD" : "OI"}</td>
                  {["k1", "k2", "eje"].map((f) => (
                    <td key={f} className="px-1 py-2">
                      <Input
                        className="h-8 w-20 text-center text-sm"
                        value={(ker[`${eye}_${f}`] as string) || ""}
                        onChange={(e) => updateNestedData("queratometria", `${eye}_${f}`, e.target.value)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Separator />

      {/* Tonometria */}
      <div>
        <h3 className="mb-4 text-base font-semibold text-foreground">Tonometria</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex flex-col gap-2">
            <Label>OD (mmHg)</Label>
            <Input
              value={(ton.od_mmhg as string) || ""}
              onChange={(e) => updateNestedData("tonometria", "od_mmhg", e.target.value)}
              placeholder="14"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>OI (mmHg)</Label>
            <Input
              value={(ton.oi_mmhg as string) || ""}
              onChange={(e) => updateNestedData("tonometria", "oi_mmhg", e.target.value)}
              placeholder="14"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Metodo</Label>
            <Select
              value={(ton.metodo as string) || "Aire"}
              onValueChange={(v) => updateNestedData("tonometria", "metodo", v)}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Aire">Aire</SelectItem>
                <SelectItem value="Goldmann">Goldmann</SelectItem>
                <SelectItem value="iCare">iCare</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Separator />

      {/* Test Complementarios */}
      <div>
        <h3 className="mb-4 text-base font-semibold text-foreground">Test Complementarios</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label>Ishihara</Label>
            <Input
              value={(tc.ishihara as string) || ""}
              onChange={(e) => updateNestedData("test_complementarios", "ishihara", e.target.value)}
              placeholder="Normal / Alterado"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Estereopsis</Label>
            <Input
              value={(tc.estereopsis as string) || ""}
              onChange={(e) => updateNestedData("test_complementarios", "estereopsis", e.target.value)}
              placeholder="Seg arco"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Schirmer OD (mm)</Label>
            <Input
              value={(tc.schirmer_od as string) || ""}
              onChange={(e) => updateNestedData("test_complementarios", "schirmer_od", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Schirmer OI (mm)</Label>
            <Input
              value={(tc.schirmer_oi as string) || ""}
              onChange={(e) => updateNestedData("test_complementarios", "schirmer_oi", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <Label>Otros test</Label>
            <Input
              value={(tc.otros as string) || ""}
              onChange={(e) => updateNestedData("test_complementarios", "otros", e.target.value)}
              placeholder="Otros examenes complementarios..."
            />
          </div>
        </div>
      </div>
    </div>
  )
}
