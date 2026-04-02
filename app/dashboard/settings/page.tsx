import { createAdminClient } from "@/lib/supabase/admin"
import { SettingsForm } from "./settings-form"

export default async function SettingsPage() {
  const supabase = createAdminClient()

  const { data: settings } = await supabase
    .from("platform_settings")
    .select("*")
    .eq("id", 1)
    .single()

  const defaults = {
    order_expiry_minutes: 10,
    min_balance:          500,
    min_stock_level:      1,
    require_document:     true,
    allow_cash:           true,
    allow_card:           false,
    otp_enabled:          true,
  }

  return <SettingsForm settings={settings ?? defaults} />
}
