import { createAdminClient } from "@/lib/supabase/admin"
import { CustomersTable } from "./customers-table"

export default async function CustomersPage() {
  const supabase = createAdminClient()

  const { data: customers, error } = await supabase
    .from('profiles')
    .select('id, full_name, phone, created_at')
    .eq('role', 'customer')
    .order('created_at', { ascending: false })

  return <CustomersTable customers={customers ?? []} />
}
