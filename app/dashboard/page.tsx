import { createAdminClient } from "@/lib/supabase/admin"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ShoppingBagIcon, TruckIcon, BanknoteIcon, ClockIcon } from "lucide-react"
import { format } from "date-fns"

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    pending:    { label: "Pending",    className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
    in_transit: { label: "In Transit", className: "bg-blue-100 text-blue-800 border-blue-200" },
    delivered:  { label: "Delivered",  className: "bg-green-100 text-green-800 border-green-200" },
    cancelled:  { label: "Cancelled",  className: "bg-red-100 text-red-800 border-red-200" },
  }
  const config = map[status] ?? { label: status, className: "bg-muted text-muted-foreground" }
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  )
}

export default async function OverviewPage() {
  const supabase = createAdminClient()
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  // Parallel data fetches
  const [
    { count: ordersToday },
    { count: activeProviders },
    { data: revenueData },
    { count: pendingApprovals },
    { data: recentOrders },
  ] = await Promise.all([
    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .gte("created_at", todayStart.toISOString()),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "provider")
      .eq("is_online", true),
    supabase
      .from("orders")
      .select("admin_fee")
      .eq("status", "delivered")
      .gte("created_at", todayStart.toISOString()),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "provider")
      .eq("is_approved", false),
    supabase
      .from("orders")
      .select(`
        id,
        status,
        total,
        created_at,
        customer:profiles!orders_customer_id_fkey(full_name)
      `)
      .order("created_at", { ascending: false })
      .limit(10),
  ])

  const revenueToday = revenueData?.reduce(
    (sum, o) => sum + (o.admin_fee ?? 0),
    0
  ) ?? 0

  const stats = [
    {
      title: "Total Orders Today",
      value: ordersToday ?? 0,
      icon: ShoppingBagIcon,
      description: "Orders placed today",
    },
    {
      title: "Active Providers",
      value: activeProviders ?? 0,
      icon: TruckIcon,
      description: "Currently online",
    },
    {
      title: "Revenue Today",
      value: `₱${revenueToday.toLocaleString()}`,
      icon: BanknoteIcon,
      description: "Admin fees collected",
    },
    {
      title: "Pending Approvals",
      value: pendingApprovals ?? 0,
      icon: ClockIcon,
      description: "Providers awaiting review",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-[#16A34A]" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders && recentOrders.length > 0 ? (
                recentOrders.map((order) => {
                  const customer = Array.isArray(order.customer)
                    ? order.customer[0]
                    : order.customer
                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-xs">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </TableCell>
                      <TableCell>{customer?.full_name ?? "—"}</TableCell>
                      <TableCell>
                        <StatusBadge status={order.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        ₱{Number(order.total ?? 0).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground text-sm">
                        {format(new Date(order.created_at), "d MMM, HH:mm")}
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    No orders yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
