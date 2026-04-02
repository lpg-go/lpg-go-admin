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
import { BanknoteIcon } from "lucide-react"
import { format } from "date-fns"

export default async function TopupsPage() {
  const supabase = createAdminClient()

  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  const [{ data: topups }, { data: todayTopups }] = await Promise.all([
    supabase
      .from("topups")
      .select(`
        id,
        amount,
        method,
        status,
        created_at,
        provider:profiles!topups_provider_id_fkey(name)
      `)
      .order("created_at", { ascending: false })
      .limit(200),
    supabase
      .from("topups")
      .select("amount")
      .gte("created_at", todayStart.toISOString()),
  ])

  const totalToday = todayTopups?.reduce((sum, t) => sum + (t.amount ?? 0), 0) ?? 0

  function StatusBadge({ status }: { status: string }) {
    const map: Record<string, { label: string; className: string }> = {
      completed: { label: "Completed", className: "bg-green-100 text-green-800 border-green-200" },
      pending:   { label: "Pending",   className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
      failed:    { label: "Failed",    className: "bg-red-100 text-red-800 border-red-200" },
    }
    const config = map[status] ?? { label: status, className: "bg-muted text-muted-foreground" }
    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stat */}
      <Card className="w-fit">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Top-ups Today
          </CardTitle>
          <BanknoteIcon className="h-4 w-4 text-[#16A34A]" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">₱{totalToday.toLocaleString()}</p>
        </CardContent>
      </Card>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Provider</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topups && topups.length > 0 ? (
              topups.map((topup) => {
                const provider = Array.isArray(topup.provider)
                  ? topup.provider[0]
                  : topup.provider
                return (
                  <TableRow key={topup.id}>
                    <TableCell className="font-medium">{provider?.name ?? "—"}</TableCell>
                    <TableCell className="text-right">
                      ₱{Number(topup.amount ?? 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="capitalize text-muted-foreground">
                      {topup.method ?? "—"}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={topup.status} />
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground text-sm">
                      {format(new Date(topup.created_at), "d MMM yyyy, HH:mm")}
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No top-ups yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
