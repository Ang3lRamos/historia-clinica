"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import type { ClinicalFormData } from "./clinical-history-form"

interface TabAntecedentesProps {
  formData: ClinicalFormData
  updateNestedData: (key: keyof ClinicalFormData, field: string, value: unknown) => void
}

function CheckboxField({
  label,
  checked,
  onCheckedChange,
}: {
  label: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}) {
  return (
    <div className="flex items-center gap-2">
      <Checkbox checked={checked} onCheckedChange={onCheckedChange} />
      <Label className="cursor-pointer text-sm font-normal text-foreground">{label}</Label>
    </div>
  )
}

export function TabAntecedentes({ formData, updateNestedData }: TabAntecedentesProps) {
  const ap = formData.antecedentes_personales as Record<string, unknown>
  const af = formData.antecedentes_familiares as Record<string, unknown>
  const ao = formData.antecedentes_ocupacionales as Record<string, unknown>

  return (
    <div className="flex flex-col gap-8">
      {/* Antecedentes Personales */}
      <div>
        <h3 className="mb-4 text-base font-semibold text-foreground">Antecedentes Personales</h3>
        <div className="grid gap-3 md:grid-cols-3">
          <CheckboxField
            label="Diabetes"
            checked={!!ap.diabetes}
            onCheckedChange={(v) => updateNestedData("antecedentes_personales", "diabetes", v)}
          />
          <CheckboxField
            label="Hipertension"
            checked={!!ap.hipertension}
            onCheckedChange={(v) => updateNestedData("antecedentes_personales", "hipertension", v)}
          />
          <CheckboxField
            label="Migranas"
            checked={!!ap.migranas}
            onCheckedChange={(v) => updateNestedData("antecedentes_personales", "migranas", v)}
          />
          <CheckboxField
            label="Alergias"
            checked={!!ap.alergias}
            onCheckedChange={(v) => updateNestedData("antecedentes_personales", "alergias", v)}
          />
          <CheckboxField
            label="Cirugias oculares"
            checked={!!ap.cirugias_oculares}
            onCheckedChange={(v) => updateNestedData("antecedentes_personales", "cirugias_oculares", v)}
          />
          <CheckboxField
            label="Usa lentes"
            checked={!!ap.usa_lentes}
            onCheckedChange={(v) => updateNestedData("antecedentes_personales", "usa_lentes", v)}
          />
        </div>
        {ap.usa_lentes && (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label>Tipo de lentes</Label>
              <Input
                value={(ap.tipo_lentes as string) || ""}
                onChange={(e) => updateNestedData("antecedentes_personales", "tipo_lentes", e.target.value)}
                placeholder="Monofocales, bifocales, progresivos..."
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Desde cuando</Label>
              <Input
                value={(ap.desde_cuando as string) || ""}
                onChange={(e) => updateNestedData("antecedentes_personales", "desde_cuando", e.target.value)}
                placeholder="2 anios, 5 anios..."
              />
            </div>
          </div>
        )}
        <div className="mt-4 flex flex-col gap-2">
          <Label>Otros antecedentes personales</Label>
          <Input
            value={(ap.otros as string) || ""}
            onChange={(e) => updateNestedData("antecedentes_personales", "otros", e.target.value)}
            placeholder="Otros antecedentes relevantes..."
          />
        </div>
      </div>

      <Separator />

      {/* Antecedentes Familiares */}
      <div>
        <h3 className="mb-4 text-base font-semibold text-foreground">Antecedentes Familiares</h3>
        <div className="grid gap-3 md:grid-cols-3">
          <CheckboxField
            label="Diabetes"
            checked={!!af.diabetes}
            onCheckedChange={(v) => updateNestedData("antecedentes_familiares", "diabetes", v)}
          />
          <CheckboxField
            label="Hipertension"
            checked={!!af.hipertension}
            onCheckedChange={(v) => updateNestedData("antecedentes_familiares", "hipertension", v)}
          />
          <CheckboxField
            label="Glaucoma"
            checked={!!af.glaucoma}
            onCheckedChange={(v) => updateNestedData("antecedentes_familiares", "glaucoma", v)}
          />
          <CheckboxField
            label="Cataratas"
            checked={!!af.cataratas}
            onCheckedChange={(v) => updateNestedData("antecedentes_familiares", "cataratas", v)}
          />
          <CheckboxField
            label="Miopia"
            checked={!!af.miopia}
            onCheckedChange={(v) => updateNestedData("antecedentes_familiares", "miopia", v)}
          />
        </div>
        <div className="mt-4 flex flex-col gap-2">
          <Label>Otros antecedentes familiares</Label>
          <Input
            value={(af.otros as string) || ""}
            onChange={(e) => updateNestedData("antecedentes_familiares", "otros", e.target.value)}
            placeholder="Otros antecedentes relevantes..."
          />
        </div>
      </div>

      <Separator />

      {/* Antecedentes Ocupacionales */}
      <div>
        <h3 className="mb-4 text-base font-semibold text-foreground">Antecedentes Ocupacionales</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex flex-col gap-2">
            <Label>Cargo</Label>
            <Input
              value={(ao.cargo as string) || ""}
              onChange={(e) => updateNestedData("antecedentes_ocupacionales", "cargo", e.target.value)}
              placeholder="Operario, administrativo..."
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Empresa</Label>
            <Input
              value={(ao.empresa as string) || ""}
              onChange={(e) => updateNestedData("antecedentes_ocupacionales", "empresa", e.target.value)}
              placeholder="Nombre de la empresa"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Tiempo en el cargo</Label>
            <Input
              value={(ao.tiempo_cargo as string) || ""}
              onChange={(e) => updateNestedData("antecedentes_ocupacionales", "tiempo_cargo", e.target.value)}
              placeholder="2 anios, 6 meses..."
            />
          </div>
        </div>
        <div className="mt-4">
          <Label className="mb-3 block text-sm font-medium">Exposiciones</Label>
          <div className="grid gap-3 md:grid-cols-3">
            <CheckboxField
              label="Pantalla / VDT"
              checked={!!ao.exposicion_pantalla}
              onCheckedChange={(v) => updateNestedData("antecedentes_ocupacionales", "exposicion_pantalla", v)}
            />
            <CheckboxField
              label="Quimicos"
              checked={!!ao.exposicion_quimicos}
              onCheckedChange={(v) => updateNestedData("antecedentes_ocupacionales", "exposicion_quimicos", v)}
            />
            <CheckboxField
              label="Soldadura"
              checked={!!ao.exposicion_soldadura}
              onCheckedChange={(v) => updateNestedData("antecedentes_ocupacionales", "exposicion_soldadura", v)}
            />
            <CheckboxField
              label="Polvo / particulas"
              checked={!!ao.exposicion_polvo}
              onCheckedChange={(v) => updateNestedData("antecedentes_ocupacionales", "exposicion_polvo", v)}
            />
            <CheckboxField
              label="Usa EPP visual"
              checked={!!ao.usa_epp_visual}
              onCheckedChange={(v) => updateNestedData("antecedentes_ocupacionales", "usa_epp_visual", v)}
            />
          </div>
        </div>
        {ao.usa_epp_visual && (
          <div className="mt-4 flex flex-col gap-2">
            <Label>Tipo de EPP</Label>
            <Input
              value={(ao.tipo_epp as string) || ""}
              onChange={(e) => updateNestedData("antecedentes_ocupacionales", "tipo_epp", e.target.value)}
              placeholder="Gafas de seguridad, careta..."
            />
          </div>
        )}
      </div>
    </div>
  )
}
