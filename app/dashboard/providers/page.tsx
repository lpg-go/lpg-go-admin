import { createAdminClient } from "@/lib/supabase/admin"
import { ProvidersTable } from "./providers-table"

export default async function ProvidersPage() {
  const supabase = createAdminClient()

  const { data: providers, error } = await supabase
    .from('profiles')
    .select('id, full_name, phone, provider_type, business_name, is_approved, is_online, balance, created_at')
    .eq('role', 'provider')
    .order('created_at', { ascending: false })

  return <ProvidersTable providers={providers ?? []} />
}
