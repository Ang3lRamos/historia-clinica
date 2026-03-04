import { createClient } from "@/lib/supabase/server"
import { PatientsListContent } from "@/components/patients-list-content"

export default async function PacientesPage() {
  const supabase = await createClient()

  const { data: patients } = await supabase
    .from("patients")
    .select("*")
    .order("created_at", { ascending: false })

  return <PatientsListContent patients={patients || []} />
}
