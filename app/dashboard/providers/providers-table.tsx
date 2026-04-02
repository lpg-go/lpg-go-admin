"use client"

import { useState, useTransition } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { approveProvider, rejectProvider } from "./actions"
import { format } from "date-fns"

type Provider = {
  id: string
  full_name: string
  business_name: string | null
  provider_type: string | null
  is_approved: boolean
  is_online: boolean
  balance: number
  orders_count: number
  created_at: string
}

const TABS = ["all", "pending", "approved", "online"] as const
type Tab = (typeof TABS)[number]

export function ProvidersTable({ providers }: { providers: Provider[] }) {
  const [tab, setTab] = useState<Tab>("all")
  const [isPending, startTransition] = useTransition()

  const filtered = providers.filter((p) => {
    if (tab === "pending")  return !p.is_approved
    if (tab === "approved") return p.is_approved
    if (tab === "online")   return p.is_online
    return true
  })

  function handleApprove(id: string) {
    startTransition(() => approveProvider(id))
  }

  function handleReject(id: string) {
    startTransition(() => rejectProvider(id))
  }

  return (
    <div className="space-y-4">
      <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)}>
        <TabsList variant="line">
          {TABS.map((t) => (
            <TabsTrigger key={t} value={t} className="capitalize">
              {t === "pending" ? "Pending Approval" : t.charAt(0).toUpperCase() + t.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Business</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Balance</TableHead>
              <TableHead className="text-right">Orders</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length > 0 ? (
              filtered.map((provider) => (
                <TableRow key={provider.id}>
                  <TableCell className="font-medium">{provider.full_name}</TableCell>
                  <TableCell className="capitalize text-muted-foreground">
                    {provider.provider_type ?? "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {provider.business_name ?? "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      <Badge
                        variant="outline"
                        className={
                          provider.is_approved
                            ? "bg-green-100 text-green-800 border-green-200"
                            : "bg-yellow-100 text-yellow-800 border-yellow-200"
                        }
                      >
                        {provider.is_approved ? "Approved" : "Pending"}
                      </Badge>
                      {provider.is_online && (
                        <Badge
                          variant="outline"
                          className="bg-blue-100 text-blue-800 border-blue-200"
                        >
                          Online
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    ₱{Number(provider.balance ?? 0).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">{provider.orders_count ?? 0}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {format(new Date(provider.created_at), "d MMM yyyy")}
                  </TableCell>
                  <TableCell>
                    {!provider.is_approved && (
                      <div className="flex items-center gap-1.5 justify-end">
                        <Button
                          size="sm"
                          className="h-7 bg-[#16A34A] hover:bg-[#15803d] text-white"
                          disabled={isPending}
                          onClick={() => handleApprove(provider.id)}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-destructive hover:text-destructive"
                          disabled={isPending}
                          onClick={() => handleReject(provider.id)}
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                  No providers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
