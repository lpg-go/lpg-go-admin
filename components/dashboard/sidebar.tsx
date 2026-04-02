"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboardIcon,
  ShoppingBagIcon,
  TruckIcon,
  UsersIcon,
  PackageIcon,
  CreditCardIcon,
  SettingsIcon,
  LogOutIcon,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { label: "Overview",   href: "/dashboard",           icon: LayoutDashboardIcon },
  { label: "Orders",     href: "/dashboard/orders",    icon: ShoppingBagIcon },
  { label: "Providers",  href: "/dashboard/providers", icon: TruckIcon },
  { label: "Customers",  href: "/dashboard/customers", icon: UsersIcon },
  { label: "Products",   href: "/dashboard/products",  icon: PackageIcon },
  { label: "Top-ups",    href: "/dashboard/topups",    icon: CreditCardIcon },
  { label: "Settings",   href: "/dashboard/settings",  icon: SettingsIcon },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-border bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#16A34A]">
            <span className="text-sm font-bold text-white">L</span>
          </div>
          <span className="text-base font-semibold tracking-tight">LPG Go Admin</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-[#16A34A]/10 text-[#16A34A]"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Sign out */}
      <div className="border-t border-border p-3">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <LogOutIcon className="h-4 w-4 shrink-0" />
          Sign out
        </button>
      </div>
    </aside>
  )
}
