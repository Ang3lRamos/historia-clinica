"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ClinicalFormData } from "./clinical-history-form"

interface TabDatosGeneralesProps {
  formData: ClinicalFormData
  patients: Array<{
    id: string
    nombre: string
    apellido: string
    documento_tipo: string
    documento_numero: string
  }>
  updateFormData: (updates: Partial<ClinicalFormData>) => void
}

export function TabDatosGenerales({ formData, patients, updateFormData }: TabDatosGeneralesProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2 md:col-span-2">
          <Label htmlFor="patient_id">Paciente *</Label>
          <Select value={formData.patient_id} onValueChange={(v) => updateFormData({ patient_id: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccione un paciente" />
            </SelectTrigger>
            <SelectContent>
              {patients.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.nombre} {p.apellido} - {p.documento_tipo} {p.documento_numero}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="fecha_examen">Fecha del Examen</Label>
          <Input
            id="fecha_examen"
            type="date"
            value={formData.fecha_examen}
            onChange={(e) => updateFormData({ fecha_examen: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="tipo_examen">Tipo de Examen</Label>
          <Select value={formData.tipo_examen} onValueChange={(v) => updateFormData({ tipo_examen: v })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Visiometria Ocupacional">Visiometria Ocupacional</SelectItem>
              <SelectItem value="Examen de Ingreso">Examen de Ingreso</SelectItem>
              <SelectItem value="Examen Periodico">Examen Periodico</SelectItem>
              <SelectItem value="Examen de Retiro">Examen de Retiro</SelectItem>
              <SelectItem value="Consulta Optometrica">Consulta Optometrica</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2 md:col-span-2">
          <Label htmlFor="motivo_consulta">Motivo de Consulta</Label>
          <Textarea
            id="motivo_consulta"
            placeholder="Describa el motivo de la consulta..."
            value={formData.motivo_consulta}
            onChange={(e) => updateFormData({ motivo_consulta: e.target.value })}
            rows={3}
          />
        </div>
      </div>
    </div>
  )
}
