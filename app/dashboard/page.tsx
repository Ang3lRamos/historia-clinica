import { createClient } from "@/lib/supabase/server"
import { DashboardContent } from "@/components/dashboard-content"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch stats
  const [patientsResult, historiesResult, recentHistoriesResult] = await Promise.all([
    supabase.from("patients").select("id", { count: "exact", head: true }),
    supabase.from("clinical_histories").select("id", { count: "exact", head: true }),
    supabase
      .from("clinical_histories")
      .select(`
        id,
        fecha_examen,
        tipo_examen,
        concepto,
        profesional_nombre,
        created_at,
        patients (id, nombre, apellido, documento_numero)
      `)
      .order("created_at", { ascending: false })
      .limit(5),
  ])

  // Histories this month
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)
  const { count: thisMonthCount } = await supabase
    .from("clinical_histories")
    .select("id", { count: "exact", head: true })
    .gte("created_at", startOfMonth.toISOString())

  return (
    <DashboardContent
      userName={user?.user_metadata?.nombre_completo || "Doctor"}
      totalPatients={patientsResult.count || 0}
      totalHistories={historiesResult.count || 0}
      thisMonthHistories={thisMonthCount || 0}
      recentHistories={recentHistoriesResult.data || []}
    />
  )
}
