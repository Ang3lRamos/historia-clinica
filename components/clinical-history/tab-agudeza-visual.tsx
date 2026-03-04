"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import type { ClinicalFormData } from "./clinical-history-form"

interface TabAgudezaVisualProps {
  formData: ClinicalFormData
  updateNestedData: (key: keyof ClinicalFormData, field: string, value: unknown) => void
}

function VisualAcuityRow({
  label,
  odField,
  oiField,
  aoField,
  data,
  updateNestedData,
  dataKey,
}: {
  label: string
  odField: string
  oiField: string
  aoField: string
  data: Record<string, unknown>
  updateNestedData: (key: keyof ClinicalFormData, field: string, value: unknown) => void
  dataKey: keyof ClinicalFormData
}) {
  return (
    <tr>
      <td className="whitespace-nowrap py-2 pr-4 text-sm font-medium text-foreground">{label}</td>
      <td className="px-1 py-2">
        <Input
          className="h-8 w-20 text-center text-sm"
          placeholder="20/"
          value={(data[odField] as string) || ""}
          onChange={(e) => updateNestedData(dataKey, odField, e.target.value)}
        />
      </td>
      <td className="px-1 py-2">
        <Input
          className="h-8 w-20 text-center text-sm"
          placeholder="20/"
          value={(data[oiField] as string) || ""}
          onChange={(e) => updateNestedData(dataKey, oiField, e.target.value)}
        />
      </td>
      <td className="px-1 py-2">
        <Input
          className="h-8 w-20 text-center text-sm"
          placeholder="20/"
          value={(data[aoField] as string) || ""}
          onChange={(e) => updateNestedData(dataKey, aoField, e.target.value)}
        />
      </td>
    </tr>
  )
}

export function TabAgudezaVisual({ formData, updateNestedData }: TabAgudezaVisualProps) {
  const av = formData.agudeza_visual as Record<string, unknown>

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="mb-4 text-base font-semibold text-foreground">Agudeza Visual</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Registre los valores de agudeza visual en escala Snellen (ej: 20/20, 20/30)
        </p>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="pb-2 text-left text-xs font-medium text-muted-foreground"></th>
                <th className="pb-2 text-center text-xs font-medium text-muted-foreground">OD (Derecho)</th>
                <th className="pb-2 text-center text-xs font-medium text-muted-foreground">OI (Izquierdo)</th>
                <th className="pb-2 text-center text-xs font-medium text-muted-foreground">AO (Ambos)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={4} className="pb-2 pt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Sin Correccion (SC)
                </td>
              </tr>
              <VisualAcuityRow label="Lejos" odField="sc_od_lejos" oiField="sc_oi_lejos" aoField="sc_ao_lejos" data={av} updateNestedData={updateNestedData} dataKey="agudeza_visual" />
              <tr>
                <td className="whitespace-nowrap py-2 pr-4 text-sm font-medium text-foreground">Cerca</td>
                <td className="px-1 py-2">
                  <Input
                    className="h-8 w-20 text-center text-sm"
                    placeholder="20/"
                    value={(av.sc_od_cerca as string) || ""}
                    onChange={(e) => updateNestedData("agudeza_visual", "sc_od_cerca", e.target.value)}
                  />
                </td>
                <td className="px-1 py-2">
                  <Input
                    className="h-8 w-20 text-center text-sm"
                    placeholder="20/"
                    value={(av.sc_oi_cerca as string) || ""}
                    onChange={(e) => updateNestedData("agudeza_visual", "sc_oi_cerca", e.target.value)}
                  />
                </td>
                <td className="px-1 py-2">
                  <Input
                    className="h-8 w-20 text-center text-sm"
                    placeholder="20/"
                    value={(av.sc_ao_cerca as string) || ""}
                    onChange={(e) => updateNestedData("agudeza_visual", "sc_ao_cerca", e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td colSpan={4} className="pb-2 pt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Con Correccion (CC)
                </td>
              </tr>
              <VisualAcuityRow label="Lejos" odField="cc_od_lejos" oiField="cc_oi_lejos" aoField="cc_ao_lejos" data={av} updateNestedData={updateNestedData} dataKey="agudeza_visual" />
              <tr>
                <td className="whitespace-nowrap py-2 pr-4 text-sm font-medium text-foreground">Cerca</td>
                <td className="px-1 py-2">
                  <Input
                    className="h-8 w-20 text-center text-sm"
                    placeholder="20/"
                    value={(av.cc_od_cerca as string) || ""}
                    onChange={(e) => updateNestedData("agudeza_visual", "cc_od_cerca", e.target.value)}
                  />
                </td>
                <td className="px-1 py-2">
                  <Input
                    className="h-8 w-20 text-center text-sm"
                    placeholder="20/"
                    value={(av.cc_oi_cerca as string) || ""}
                    onChange={(e) => updateNestedData("agudeza_visual", "cc_oi_cerca", e.target.value)}
                  />
                </td>
                <td className="px-1 py-2">
                  <Input
                    className="h-8 w-20 text-center text-sm"
                    placeholder="20/"
                    value={(av.cc_ao_cerca as string) || ""}
                    onChange={(e) => updateNestedData("agudeza_visual", "cc_ao_cerca", e.target.value)}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Pinhole */}
      <div>
        <h3 className="mb-4 text-base font-semibold text-foreground">Agujero Estenopeico (PH)</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label>OD (Derecho)</Label>
            <Input
              placeholder="20/"
              value={(av.ph_od as string) || ""}
              onChange={(e) => updateNestedData("agudeza_visual", "ph_od", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>OI (Izquierdo)</Label>
            <Input
              placeholder="20/"
              value={(av.ph_oi as string) || ""}
              onChange={(e) => updateNestedData("agudeza_visual", "ph_oi", e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
