"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { Upload, X } from "lucide-react"
import { toast } from "sonner"
import type { ClinicalFormData } from "./clinical-history-form"

interface TabDiagnosticoProps {
  formData: ClinicalFormData
  updateFormData: (updates: Partial<ClinicalFormData>) => void
}

function SignatureUpload({
  label,
  value,
  onUpload,
  onClear,
}: {
  label: string
  value: string
  onUpload: (url: string) => void
  onClear: () => void
}) {
  const [uploading, setUploading] = useState(false)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const supabase = createClient()

    const fileExt = file.name.split(".").pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

    const { error } = await supabase.storage
      .from("signatures")
      .upload(fileName, file)

    if (error) {
      toast.error("Error al subir firma: " + error.message)
      setUploading(false)
      return
    }

    const { data: urlData } = supabase.storage
      .from("signatures")
      .getPublicUrl(fileName)

    onUpload(urlData.publicUrl)
    setUploading(false)
    toast.success("Firma subida exitosamente")
  }

  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      {value ? (
        <div className="relative inline-block">
          <img
            src={value}
            alt={label}
            className="h-24 w-48 rounded-lg border border-border bg-card object-contain p-2"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -right-2 -top-2 h-6 w-6"
            onClick={onClear}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border px-4 py-3 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary">
            <Upload className="h-4 w-4" />
            {uploading ? "Subiendo..." : "Subir imagen de firma"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
        </div>
      )}
    </div>
  )
}

export function TabDiagnostico({ formData, updateFormData }: TabDiagnosticoProps) {
  return (
    <div className="flex flex-col gap-8">
      {/* Diagnostico */}
      <div>
        <h3 className="mb-4 text-base font-semibold text-foreground">Diagnostico</h3>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>Diagnostico</Label>
            <Textarea
              value={formData.diagnostico}
              onChange={(e) => updateFormData({ diagnostico: e.target.value })}
              placeholder="Emetropia AO, astigmatismo miope compuesto..."
              rows={3}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Conducta / Recomendaciones</Label>
            <Textarea
              value={formData.conducta}
              onChange={(e) => updateFormData({ conducta: e.target.value })}
              placeholder="Uso de lentes correctivos, control anual..."
              rows={3}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Observaciones</Label>
            <Textarea
              value={formData.observaciones}
              onChange={(e) => updateFormData({ observaciones: e.target.value })}
              placeholder="Observaciones adicionales..."
              rows={2}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Concepto */}
      <div>
        <h3 className="mb-4 text-base font-semibold text-foreground">Concepto Ocupacional</h3>
        <Select
          value={formData.concepto}
          onValueChange={(v) => updateFormData({ concepto: v })}
        >
          <SelectTrigger className="w-full md:w-80">
            <SelectValue placeholder="Seleccione el concepto" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Apto">Apto</SelectItem>
            <SelectItem value="Apto con restricciones">Apto con restricciones</SelectItem>
            <SelectItem value="No apto">No apto</SelectItem>
            <SelectItem value="Aplazado">Aplazado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Profesional Info */}
      <div>
        <h3 className="mb-4 text-base font-semibold text-foreground">Datos del Profesional</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label>Nombre del Profesional</Label>
            <Input
              value={formData.profesional_nombre}
              onChange={(e) => updateFormData({ profesional_nombre: e.target.value })}
              placeholder="Dr. Juan Perez"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Registro Profesional / T.P.</Label>
            <Input
              value={formData.profesional_registro}
              onChange={(e) => updateFormData({ profesional_registro: e.target.value })}
              placeholder="TP 12345"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Signatures */}
      <div>
        <h3 className="mb-4 text-base font-semibold text-foreground">Firmas</h3>
        <div className="grid gap-6 md:grid-cols-2">
          <SignatureUpload
            label="Firma del Profesional"
            value={formData.firma_profesional_url}
            onUpload={(url) => updateFormData({ firma_profesional_url: url })}
            onClear={() => updateFormData({ firma_profesional_url: "" })}
          />
          <SignatureUpload
            label="Firma del Paciente"
            value={formData.firma_paciente_url}
            onUpload={(url) => updateFormData({ firma_paciente_url: url })}
            onClear={() => updateFormData({ firma_paciente_url: "" })}
          />
        </div>
      </div>
    </div>
  )
}
