"use client"

import { useState, useTransition } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { saveSettings, type PlatformSettings } from "./actions"
import { toast } from "sonner"

export function SettingsForm({ settings }: { settings: PlatformSettings }) {
  const [isPending, startTransition] = useTransition()
  const [form, setForm] = useState<PlatformSettings>(settings)

  function setNum(key: keyof PlatformSettings, value: string) {
    setForm((prev) => ({ ...prev, [key]: Number(value) }))
  }

  function setBool(key: keyof PlatformSettings, value: boolean) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handleSave() {
    startTransition(async () => {
      await saveSettings(form)
      toast.success("Settings saved successfully")
    })
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Order settings */}
      <Card>
        <CardHeader>
          <CardTitle>Order Settings</CardTitle>
          <CardDescription>Configure how orders are processed</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="expiry">Order Expiry Time (minutes)</Label>
            <Input
              id="expiry"
              type="number"
              min={1}
              value={form.order_expiry_minutes}
              onChange={(e) => setNum("order_expiry_minutes", e.target.value)}
              className="w-40"
            />
            <p className="text-xs text-muted-foreground">
              How long before an unaccepted order expires
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="min-balance">Minimum Balance to Accept Orders (₱)</Label>
            <Input
              id="min-balance"
              type="number"
              min={0}
              value={form.min_balance}
              onChange={(e) => setNum("min_balance", e.target.value)}
              className="w-40"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="min-stock">Minimum Product Stock Level</Label>
            <Input
              id="min-stock"
              type="number"
              min={0}
              value={form.min_stock_level}
              onChange={(e) => setNum("min_stock_level", e.target.value)}
              className="w-40"
            />
          </div>
        </CardContent>
      </Card>

      {/* Provider settings */}
      <Card>
        <CardHeader>
          <CardTitle>Provider Settings</CardTitle>
          <CardDescription>Onboarding and compliance requirements</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Require Provider Documents</p>
              <p className="text-xs text-muted-foreground">
                Providers must upload documents before approval
              </p>
            </div>
            <Switch
              checked={form.require_document}
              onCheckedChange={(v) => setBool("require_document", v)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Payment settings */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>Control which payment options customers can use</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Allow Cash Payment</p>
              <p className="text-xs text-muted-foreground">Customers can pay with cash on delivery</p>
            </div>
            <Switch
              checked={form.allow_cash}
              onCheckedChange={(v) => setBool("allow_cash", v)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Allow Card Payment</p>
              <p className="text-xs text-muted-foreground">Customers can pay with debit/credit card</p>
            </div>
            <Switch
              checked={form.allow_card}
              onCheckedChange={(v) => setBool("allow_card", v)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Security settings */}
      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">OTP Verification</p>
              <p className="text-xs text-muted-foreground">
                Require OTP for login and sensitive actions
              </p>
            </div>
            <Switch
              checked={form.otp_enabled}
              onCheckedChange={(v) => setBool("otp_enabled", v)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end pb-6">
        <Button
          className="bg-[#16A34A] hover:bg-[#15803d] text-white px-8"
          onClick={handleSave}
          disabled={isPending}
        >
          {isPending ? "Saving…" : "Save Settings"}
        </Button>
      </div>
    </div>
  )
}
