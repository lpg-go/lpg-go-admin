"use server"

import { revalidatePath } from "next/cache"
import { createAdminClient } from "@/lib/supabase/admin"

export type PlatformSettings = {
  order_expiry_minutes: number
  min_balance: number
  min_stock_level: number
  require_document: boolean
  allow_cash: boolean
  allow_card: boolean
  otp_enabled: boolean
}

export async function saveSettings(settings: PlatformSettings) {
  const supabase = createAdminClient()
  // Upsert into the first (and only) settings row
  await supabase
    .from("platform_settings")
    .upsert({ id: 1, ...settings })
    .eq("id", 1)
  revalidatePath("/dashboard/settings")
}
