"use server"

import { revalidatePath } from "next/cache"
import { createAdminClient } from "@/lib/supabase/admin"

export async function approveProvider(providerId: string) {
  const supabase = createAdminClient()
  await supabase
    .from("profiles")
    .update({ is_approved: true })
    .eq("id", providerId)
  revalidatePath("/dashboard/providers")
}

export async function rejectProvider(providerId: string) {
  const supabase = createAdminClient()
  await supabase
    .from("profiles")
    .update({ is_approved: false })
    .eq("id", providerId)
  revalidatePath("/dashboard/providers")
}
