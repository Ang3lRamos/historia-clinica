import { createClient } from "@/lib/supabase/server"
import { ClinicalHistoryForm } from "@/components/clinical-history/clinical-history-form"

export default async function NuevaHistoriaPage({
  searchParams,
}: {
  searchParams: Promise<{ paciente?: string }>
}) {
  const { paciente: pacienteId } = await searchParams
  const supabase = await createClient()

  // Fetch patients for the select dropdown
  const { data: patients } = await supabase
    .from("patients")
    .select("id, nombre, apellido, documento_tipo, documento_numero")
    .order("nombre", { ascending: true })

  // Fetch profile for professional info
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from("profiles")
    .select("nombre_completo")
    .eq("id", user!.id)
    .single()

  return (
    <ClinicalHistoryForm
      patients={patients || []}
      preselectedPatientId={pacienteId}
      professionalName={profile?.nombre_completo || user?.user_metadata?.nombre_completo || ""}
    />
  )
}
