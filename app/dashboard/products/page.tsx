import { createAdminClient } from "@/lib/supabase/admin"
import { ProductsClient } from "./products-client"

export default async function ProductsPage() {
  const supabase = createAdminClient()

  const { data: brands } = await supabase
    .from('brands')
    .select('id, name, logo_url, is_active, created_at')
    .order('name', { ascending: true })

  const { data: products } = await supabase
    .from('products')
    .select('id, name, size_kg, admin_fee, is_active, brand_id, created_at')
    .order('size_kg', { ascending: true })

  return (
    <ProductsClient
      brands={brands ?? []}
      products={products ?? []}
    />
  )
}
