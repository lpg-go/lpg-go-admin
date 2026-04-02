import { createAdminClient } from "@/lib/supabase/admin"
import { OrdersTable } from "./orders-table"

export default async function OrdersPage() {
  const supabase = createAdminClient()

  const { data: orders } = await supabase
    .from("orders")
    .select(`
      id,
      status,
      total,
      items,
      created_at,
      customer:profiles!orders_customer_id_fkey(full_name, phone),
      provider:profiles!orders_provider_id_fkey(full_name)
    `)
    .order("created_at", { ascending: false })
    .limit(200)

  return <OrdersTable orders={(orders ?? []) as any} />
}
