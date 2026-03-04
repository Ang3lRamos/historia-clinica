"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

import { TabDatosGenerales } from "./tab-datos-generales"
import { TabAntecedentes } from "./tab-antecedentes"
import { TabAgudezaVisual } from "./tab-agudeza-visual"
import { TabExamenClinico } from "./tab-examen-clinico"
import { TabDiagnostico } from "./tab-diagnostico"

interface PatientOption {
  id: string
  nombre: string
  apellido: string
  documento_tipo: string
  documento_numero: string
}

export interface ClinicalFormData {
  patient_id: string
  fecha_examen: string
  tipo_examen: string
  motivo_consulta: string
  antecedentes_personales: Record<string, unknown>
  antecedentes_familiares: Record<string, unknown>
  antecedentes_ocupacionales: Record<string, unknown>
  agudeza_visual: Record<string, unknown>
  examen_externo: Record<string, unknown>
  queratometria: Record<string, unknown>
  oftalmoscopia: Record<string, unknown>
  refraccion: Record<string, unknown>
  lensometria: Record<string, unknown>
  tonometria: Record<string, unknown>
  test_complementarios: Record<string, unknown>
  diagnostico: string
  conducta: string
  observaciones: string
  concepto: string
  profesional_nombre: string
  profesional_registro: string
  firma_profesional_url: string
  firma_paciente_url: string
}

interface ClinicalHistoryFormProps {
  patients: PatientOption[]
  preselectedPatientId?: string
  professionalName: string
}

const defaultFormData: ClinicalFormData = {
  patient_id: "",
  fecha_examen: new Date().toISOString().split("T")[0],
  tipo_examen: "Visiometria Ocupacional",
  motivo_consulta: "",
  antecedentes_personales: {
    diabetes: false,
    hipertension: false,
    migranas: false,
    alergias: false,
    cirugias_oculares: false,
    usa_lentes: false,
    tipo_lentes: "",
    desde_cuando: "",
    otros: "",
  },
  antecedentes_familiares: {
    diabetes: false,
    hipertension: false,
    glaucoma: false,
    cataratas: false,
    miopia: false,
    otros: "",
  },
  antecedentes_ocupacionales: {
    cargo: "",
    empresa: "",
    tiempo_cargo: "",
    exposicion_pantalla: false,
    exposicion_quimicos: false,
    exposicion_soldadura: false,
    exposicion_polvo: false,
    usa_epp_visual: false,
    tipo_epp: "",
    otros: "",
  },
  agudeza_visual: {
    sc_od_lejos: "", sc_oi_lejos: "", sc_ao_lejos: "",
    sc_od_cerca: "", sc_oi_cerca: "", sc_ao_cerca: "",
    cc_od_lejos: "", cc_oi_lejos: "", cc_ao_lejos: "",
    cc_od_cerca: "", cc_oi_cerca: "", cc_ao_cerca: "",
    ph_od: "", ph_oi: "",
  },
  examen_externo: {
    parpados_od: "Normal", parpados_oi: "Normal",
    conjuntiva_od: "Normal", conjuntiva_oi: "Normal",
    cornea_od: "Normal", cornea_oi: "Normal",
    iris_od: "Normal", iris_oi: "Normal",
    pupila_od: "Normal", pupila_oi: "Normal",
    cristalino_od: "Normal", cristalino_oi: "Normal",
    motilidad: "Normal",
    cover_test: "Normal",
    ppc: "",
    observaciones: "",
  },
  queratometria: {
    od_k1: "", od_k2: "", od_eje: "",
    oi_k1: "", oi_k2: "", oi_eje: "",
  },
  oftalmoscopia: {
    od_papila: "Normal", od_excavacion: "", od_vasos: "Normal", od_macula: "Normal", od_retina: "Normal",
    oi_papila: "Normal", oi_excavacion: "", oi_vasos: "Normal", oi_macula: "Normal", oi_retina: "Normal",
  },
  refraccion: {
    od_esfera: "", od_cilindro: "", od_eje: "", od_add: "", od_av: "",
    oi_esfera: "", oi_cilindro: "", oi_eje: "", oi_add: "", oi_av: "",
    dp: "", tipo_lente: "",
  },
  lensometria: {
    od_esfera: "", od_cilindro: "", od_eje: "", od_add: "",
    oi_esfera: "", oi_cilindro: "", oi_eje: "", oi_add: "",
  },
  tonometria: {
    od_mmhg: "", oi_mmhg: "", metodo: "Aire",
  },
  test_complementarios: {
    ishihara: "", estereopsis: "", schirmer_od: "", schirmer_oi: "",
    otros: "",
  },
  diagnostico: "",
  conducta: "",
  observaciones: "",
  concepto: "",
  profesional_nombre: "",
  profesional_registro: "",
  firma_profesional_url: "",
  firma_paciente_url: "",
}

export function ClinicalHistoryForm({
  patients,
  preselectedPatientId,
  professionalName,
}: ClinicalHistoryFormProps) {
  const [formData, setFormData] = useState<ClinicalFormData>({
    ...defaultFormData,
    patient_id: preselectedPatientId || "",
    profesional_nombre: professionalName,
  })
  const [activeTab, setActiveTab] = useState("datos")
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  function updateFormData(updates: Partial<ClinicalFormData>) {
    setFormData((prev) => ({ ...prev, ...updates }))
  }

  function updateNestedData(key: keyof ClinicalFormData, field: string, value: unknown) {
    setFormData((prev) => ({
      ...prev,
      [key]: {
        ...(prev[key] as Record<string, unknown>),
        [field]: value,
      },
    }))
  }

  async function handleSave() {
    if (!formData.patient_id) {
      toast.error("Seleccione un paciente")
      setActiveTab("datos")
      return
    }

    setSaving(true)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      toast.error("Sesion expirada")
      setSaving(false)
      return
    }

    const { data, error } = await supabase
      .from("clinical_histories")
      .insert({
        user_id: user.id,
        patient_id: formData.patient_id,
        fecha_examen: formData.fecha_examen,
        tipo_examen: formData.tipo_examen,
        motivo_consulta: formData.motivo_consulta,
        antecedentes_personales: formData.antecedentes_personales,
        antecedentes_familiares: formData.antecedentes_familiares,
        antecedentes_ocupacionales: formData.antecedentes_ocupacionales,
        agudeza_visual: formData.agudeza_visual,
        examen_externo: formData.examen_externo,
        queratometria: formData.queratometria,
        oftalmoscopia: formData.oftalmoscopia,
        refraccion: formData.refraccion,
        lensometria: formData.lensometria,
        tonometria: formData.tonometria,
        test_complementarios: formData.test_complementarios,
        diagnostico: formData.diagnostico,
        conducta: formData.conducta,
        observaciones: formData.observaciones,
        concepto: formData.concepto || null,
        profesional_nombre: formData.profesional_nombre,
        profesional_registro: formData.profesional_registro,
        firma_profesional_url: formData.firma_profesional_url || null,
        firma_paciente_url: formData.firma_paciente_url || null,
      })
      .select("id")
      .single()

    if (error) {
      toast.error("Error al guardar: " + error.message)
      setSaving(false)
      return
    }

    toast.success("Historia clinica guardada exitosamente")
    router.push(`/dashboard/historias/${data.id}`)
    router.refresh()
  }

  const tabs = [
    { id: "datos", label: "Datos" },
    { id: "antecedentes", label: "Antecedentes" },
    { id: "agudeza", label: "Agudeza Visual" },
    { id: "examen", label: "Examen Clinico" },
    { id: "diagnostico", label: "Diagnostico" },
  ]

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Nueva Historia Clinica</h1>
            <p className="text-sm text-muted-foreground">Visiometria Ocupacional</p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Guardando..." : "Guardar Historia"}
        </Button>
      </div>

      {/* Tabs */}
      <Card>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <CardHeader className="pb-0">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
              {tabs.map((tab) => (
                <TabsTrigger key={tab.id} value={tab.id} className="text-xs md:text-sm">
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </CardHeader>
          <CardContent className="pt-6">
            <TabsContent value="datos" className="mt-0">
              <TabDatosGenerales
                formData={formData}
                patients={patients}
                updateFormData={updateFormData}
              />
            </TabsContent>
            <TabsContent value="antecedentes" className="mt-0">
              <TabAntecedentes
                formData={formData}
                updateNestedData={updateNestedData}
              />
            </TabsContent>
            <TabsContent value="agudeza" className="mt-0">
              <TabAgudezaVisual
                formData={formData}
                updateNestedData={updateNestedData}
              />
            </TabsContent>
            <TabsContent value="examen" className="mt-0">
              <TabExamenClinico
                formData={formData}
                updateNestedData={updateNestedData}
              />
            </TabsContent>
            <TabsContent value="diagnostico" className="mt-0">
              <TabDiagnostico
                formData={formData}
                updateFormData={updateFormData}
              />
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>

      {/* Tab Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => {
            const idx = tabs.findIndex((t) => t.id === activeTab)
            if (idx > 0) setActiveTab(tabs[idx - 1].id)
          }}
          disabled={activeTab === tabs[0].id}
        >
          Anterior
        </Button>
        {activeTab === tabs[tabs.length - 1].id ? (
          <Button onClick={handleSave} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Guardando..." : "Guardar Historia"}
          </Button>
        ) : (
          <Button
            onClick={() => {
              const idx = tabs.findIndex((t) => t.id === activeTab)
              if (idx < tabs.length - 1) setActiveTab(tabs[idx + 1].id)
            }}
          >
            Siguiente
          </Button>
        )}
      </div>
    </div>
  )
}
