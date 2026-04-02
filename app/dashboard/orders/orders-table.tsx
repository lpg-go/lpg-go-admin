"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { SearchIcon } from "lucide-react"
import { format } from "date-fns"

type Order = {
  id: string
  status: string
  total: number
  items: unknown
  created_at: string
  customer: { full_name: string; phone?: string } | null
  provider: { full_name: string } | null
}

const STATUS_TABS = ["all", "pending", "in_transit", "delivered", "cancelled"] as const
type StatusTab = (typeof STATUS_TABS)[number]

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

export function OrdersTable({ orders }: { orders: Order[] }) {
  const [tab, setTab] = useState<StatusTab>("all")
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<Order | null>(null)

  const filtered = orders.filter((o) => {
    const matchesTab = tab === "all" || o.status === tab
    const q = search.toLowerCase()
    const matchesSearch =
      !q ||
      o.id.toLowerCase().includes(q) ||
      (o.customer?.full_name ?? "").toLowerCase().includes(q)
    return matchesTab && matchesSearch
  })

  return (
    <>
      <div className="space-y-4">
        {/* Filter tabs + search */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Tabs value={tab} onValueChange={(v) => setTab(v as StatusTab)}>
            <TabsList variant="line">
              {STATUS_TABS.map((s) => (
                <TabsTrigger key={s} value={s} className="capitalize">
                  {s === "in_transit" ? "In Transit" : s.charAt(0).toUpperCase() + s.slice(1)}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="relative">
            <SearchIcon className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search by ID or customer…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 w-64"
            />
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length > 0 ? (
                filtered.map((order) => (
                  <TableRow
                    key={order.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => setSelected(order)}
                  >
                    <TableCell className="font-mono text-xs">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </TableCell>
                    <TableCell>{order.customer?.full_name ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {order.provider?.full_name ?? "—"}
                    </TableCell>
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
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No orders found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Detail modal */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Order #{selected?.id.slice(0, 8).toUpperCase()}
            </DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <StatusBadge status={selected.status} />
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Customer</span>
                <span>{selected.customer?.full_name ?? "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Provider</span>
                <span>{selected.provider?.full_name ?? "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total</span>
                <span className="font-semibold">₱{Number(selected.total ?? 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date</span>
                <span>{format(new Date(selected.created_at), "d MMM yyyy, HH:mm")}</span>
              </div>
              <div className="pt-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setSelected(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
