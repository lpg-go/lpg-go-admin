"use client"

import { useState, useTransition, useRef } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PlusIcon, PencilIcon, CheckIcon, XIcon } from "lucide-react"
import {
  addBrand,
  toggleBrandStatus,
  addProduct,
  updateAdminFee,
  toggleProductStatus,
} from "./actions"

type Brand = {
  id: string
  name: string
  logo_url: string | null
  is_active: boolean
}

type Product = {
  id: string
  name: string
  size_kg: number
  admin_fee: number
  is_active: boolean
  brand_id: string
}

export function ProductsClient({
  brands,
  products,
}: {
  brands: Brand[]
  products: Product[]
}) {
  const [isPending, startTransition] = useTransition()

  const [addBrandOpen, setAddBrandOpen] = useState(false)
  const [addProductOpen, setAddProductOpen] = useState(false)

  const [editingFee, setEditingFee] = useState<string | null>(null)
  const [feeValue, setFeeValue] = useState("")

  const brandFormRef = useRef<HTMLFormElement>(null)
  const productFormRef = useRef<HTMLFormElement>(null)

  function submitAddBrand(formData: FormData) {
    startTransition(async () => {
      await addBrand(formData)
      setAddBrandOpen(false)
      brandFormRef.current?.reset()
    })
  }

  function submitAddProduct(formData: FormData) {
    startTransition(async () => {
      await addProduct(formData)
      setAddProductOpen(false)
      productFormRef.current?.reset()
    })
  }

  function startEditFee(product: Product) {
    setEditingFee(product.id)
    setFeeValue(String(product.admin_fee))
  }

  function saveFee(productId: string) {
    const fee = Number(feeValue)
    if (!isNaN(fee)) {
      startTransition(() => updateAdminFee(productId, fee))
    }
    setEditingFee(null)
  }

  const brandMap = Object.fromEntries(brands.map((b) => [b.id, b.name]))

  return (
    <div className="space-y-8">
      {/* Brands section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">Brands</h2>
          <Button
            size="sm"
            className="bg-[#16A34A] hover:bg-[#15803d] text-white"
            onClick={() => setAddBrandOpen(true)}
          >
            <PlusIcon className="mr-1.5 h-4 w-4" />
            Add Brand
          </Button>
        </div>

        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Logo URL</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {brands.length > 0 ? (
                brands.map((brand) => (
                  <TableRow key={brand.id}>
                    <TableCell className="font-medium">{brand.name}</TableCell>
                    <TableCell className="text-muted-foreground text-sm max-w-48 truncate">
                      {brand.logo_url ?? "—"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          brand.is_active
                            ? "bg-green-100 text-green-800 border-green-200"
                            : "bg-muted text-muted-foreground"
                        }
                      >
                        {brand.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7"
                        disabled={isPending}
                        onClick={() =>
                          startTransition(() => toggleBrandStatus(brand.id, brand.is_active))
                        }
                      >
                        {brand.is_active ? "Deactivate" : "Activate"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-20 text-center text-muted-foreground">
                    No brands yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Products section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">Products</h2>
          <Button
            size="sm"
            className="bg-[#16A34A] hover:bg-[#15803d] text-white"
            onClick={() => setAddProductOpen(true)}
          >
            <PlusIcon className="mr-1.5 h-4 w-4" />
            Add Product
          </Button>
        </div>

        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Size (kg)</TableHead>
                <TableHead>Admin Fee (₱)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length > 0 ? (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {brandMap[product.brand_id] ?? "—"}
                    </TableCell>
                    <TableCell>{product.size_kg}</TableCell>
                    <TableCell>
                      {editingFee === product.id ? (
                        <div className="flex items-center gap-1">
                          <Input
                            type="number"
                            value={feeValue}
                            onChange={(e) => setFeeValue(e.target.value)}
                            className="h-7 w-24"
                            autoFocus
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 text-[#16A34A]"
                            onClick={() => saveFee(product.id)}
                          >
                            <CheckIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0"
                            onClick={() => setEditingFee(null)}
                          >
                            <XIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <button
                          className="flex items-center gap-1.5 group"
                          onClick={() => startEditFee(product)}
                        >
                          <span>₱{Number(product.admin_fee).toLocaleString()}</span>
                          <PencilIcon className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          product.is_active
                            ? "bg-green-100 text-green-800 border-green-200"
                            : "bg-muted text-muted-foreground"
                        }
                      >
                        {product.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7"
                        disabled={isPending}
                        onClick={() =>
                          startTransition(() =>
                            toggleProductStatus(product.id, product.is_active)
                          )
                        }
                      >
                        {product.is_active ? "Deactivate" : "Activate"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-20 text-center text-muted-foreground">
                    No products yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Add Brand modal */}
      <Dialog open={addBrandOpen} onOpenChange={setAddBrandOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Brand</DialogTitle>
          </DialogHeader>
          <form ref={brandFormRef} action={submitAddBrand} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="brand-name">Brand Name</Label>
              <Input id="brand-name" name="name" placeholder="e.g. Gasul" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="brand-logo">Logo URL</Label>
              <Input
                id="brand-logo"
                name="logo_url"
                type="url"
                placeholder="https://example.com/logo.png"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setAddBrandOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#16A34A] hover:bg-[#15803d] text-white"
                disabled={isPending}
              >
                Add Brand
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Product modal */}
      <Dialog open={addProductOpen} onOpenChange={setAddProductOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Product</DialogTitle>
          </DialogHeader>
          <form ref={productFormRef} action={submitAddProduct} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="product-brand">Brand</Label>
              <Select name="brand_id" required>
                <SelectTrigger id="product-brand" className="w-full">
                  <SelectValue placeholder="Select a brand" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="product-name">Product Name</Label>
              <Input id="product-name" name="name" placeholder="e.g. Gasul 11kg" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="product-size">Size (kg)</Label>
              <Input
                id="product-size"
                name="size_kg"
                type="number"
                min="0"
                step="0.1"
                placeholder="11"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="product-fee">Admin Fee (₱)</Label>
              <Input
                id="product-fee"
                name="admin_fee"
                type="number"
                min="0"
                step="0.01"
                placeholder="200"
                required
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setAddProductOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#16A34A] hover:bg-[#15803d] text-white"
                disabled={isPending}
              >
                Add Product
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
