import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { HistoryDetailContent } from "@/components/history-detail-content"

export default async function HistoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: history } = await supabase
    .from("clinical_histories")
    .select(`
      *,
      patients (*)
    `)
    .eq("id", id)
    .single()

  if (!history) {
    notFound()
  }

  return <HistoryDetailContent history={history} />
}
