"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { SearchIcon } from "lucide-react"
import { format } from "date-fns"

type Customer = {
  id: string
  full_name: string
  phone: string | null
  orders_count?: number
  last_order_at?: string | null
  created_at: string
}

export function CustomersTable({ customers }: { customers: Customer[] }) {
  const [search, setSearch] = useState("")

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase()
    return (
      !q ||
      (c.full_name ?? "").toLowerCase().includes(q) ||
      (c.phone ?? "").includes(q)
    )
  })

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <div className="relative">
          <SearchIcon className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search by name or phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 w-64"
          />
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead className="text-right">Total Orders</TableHead>
              <TableHead>Last Order</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length > 0 ? (
              filtered.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.full_name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {customer.phone ?? "—"}
                  </TableCell>
                  <TableCell className="text-right">{customer.orders_count ?? 0}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {customer.last_order_at
                      ? format(new Date(customer.last_order_at), "d MMM yyyy")
                      : "Never"}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {format(new Date(customer.created_at), "d MMM yyyy")}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No customers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
