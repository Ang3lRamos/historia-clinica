import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PatientDetailContent } from "@/components/patient-detail-content"

export default async function PatientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: patient } = await supabase
    .from("patients")
    .select("*")
    .eq("id", id)
    .single()

  if (!patient) {
    notFound()
  }

  const { data: histories } = await supabase
    .from("clinical_histories")
    .select("*")
    .eq("patient_id", id)
    .order("created_at", { ascending: false })

  return <PatientDetailContent patient={patient} histories={histories || []} />
}
