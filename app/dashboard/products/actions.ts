"use server"

import { revalidatePath } from "next/cache"
import { createAdminClient } from "@/lib/supabase/admin"

export async function addBrand(formData: FormData) {
  const name = formData.get("name") as string
  const logoUrl = formData.get("logo_url") as string

  if (!name) return

  const supabase = createAdminClient()
  await supabase.from("brands").insert({ name, logo_url: logoUrl || null, is_active: true })
  revalidatePath("/dashboard/products")
}

export async function toggleBrandStatus(id: string, isActive: boolean) {
  const supabase = createAdminClient()
  await supabase.from("brands").update({ is_active: !isActive }).eq("id", id)
  revalidatePath("/dashboard/products")
}

export async function addProduct(formData: FormData) {
  const brandId = formData.get("brand_id") as string
  const name = formData.get("name") as string
  const sizeKg = Number(formData.get("size_kg"))
  const adminFee = Number(formData.get("admin_fee"))

  if (!brandId || !name) return

  const supabase = createAdminClient()
  await supabase
    .from("products")
    .insert({ brand_id: brandId, name, size_kg: sizeKg, admin_fee: adminFee, is_active: true })
  revalidatePath("/dashboard/products")
}

export async function updateAdminFee(productId: string, adminFee: number) {
  const supabase = createAdminClient()
  await supabase.from("products").update({ admin_fee: adminFee }).eq("id", productId)
  revalidatePath("/dashboard/products")
}

export async function toggleProductStatus(id: string, isActive: boolean) {
  const supabase = createAdminClient()
  await supabase.from("products").update({ is_active: !isActive }).eq("id", id)
  revalidatePath("/dashboard/products")
}
