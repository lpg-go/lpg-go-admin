"use client"

import { usePathname } from "next/navigation"

const TITLES: Record<string, string> = {
  "/dashboard":           "Overview",
  "/dashboard/orders":    "Orders",
  "/dashboard/providers": "Providers",
  "/dashboard/customers": "Customers",
  "/dashboard/products":  "Products",
  "/dashboard/topups":    "Top-ups",
  "/dashboard/settings":  "Settings",
}

export function Header() {
  const pathname = usePathname()
  const title = TITLES[pathname] ?? "Dashboard"

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
      <h1 className="text-lg font-semibold">{title}</h1>
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-[#16A34A]/10 flex items-center justify-center">
          <span className="text-xs font-semibold text-[#16A34A]">A</span>
        </div>
        <span className="text-sm font-medium">Admin</span>
      </div>
    </header>
  )
}
