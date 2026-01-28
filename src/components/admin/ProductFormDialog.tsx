import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import { productsApi } from '@/lib/api'
import type { Product } from '@/lib/api'

interface ProductFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Product | null
  onSuccess?: () => void
}

export function ProductFormDialog({
  open,
  onOpenChange,
  product,
  onSuccess,
}: ProductFormDialogProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    compare_at_price: '',
    shipping_cost: '',
    is_free_shipping: false,
    is_active: true,
    is_featured: false,
  })

  /* ------------------ Populate form ------------------ */
  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        slug: product.slug,
        description: product.description ?? '',
        price: product.price.toString(),
        compare_at_price: product.compare_at_price?.toString() ?? '',
        shipping_cost: product.shipping_cost?.toString() ?? '0',
        is_free_shipping: product.is_free_shipping,
        is_active: product.is_active,
        is_featured: product.is_featured,
      })
    } else {
      setForm({
        name: '',
        slug: '',
        description: '',
        price: '',
        compare_at_price: '',
        shipping_cost: '',
        is_free_shipping: false,
        is_active: true,
        is_featured: false,
      })
    }
  }, [product])

  /* ------------------ Submit ------------------ */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        description: form.description || null,
        price: Number(form.price),
        compare_at_price: form.compare_at_price
          ? Number(form.compare_at_price)
          : null,
        shipping_cost: form.is_free_shipping
          ? 0
          : Number(form.shipping_cost || 0),
        is_free_shipping: form.is_free_shipping,
        is_active: form.is_active,
        is_featured: form.is_featured,
      }

      if (product) {
        await productsApi.update(product.id, payload)
      } else {
        await productsApi.create(payload)
      }

      toast({
        title: product ? 'Product updated' : 'Product created',
        description: `${payload.name} saved successfully.`,
      })

      onOpenChange(false)
      onSuccess?.()
    } catch (err) {
      console.error(err)
      toast({
        title: 'Error',
        description: 'Failed to save product. Check console for details.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  /* ------------------ Helpers ------------------ */
  const generateSlug = (name: string) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

  /* ------------------ UI ------------------ */
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {product ? 'Edit Product' : 'Add New Product'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4">
            {/* Name + Slug */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>Product Name *</Label>
                <Input
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      name: e.target.value,
                      slug: generateSlug(e.target.value),
                    }))
                  }
                  required
                />
              </div>
              <div>
                <Label>URL Slug *</Label>
                <Input
                  value={form.slug}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, slug: e.target.value }))
                  }
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <Label>Description</Label>
              <Textarea
                rows={4}
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
              />
            </div>

            {/* Pricing */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <Label>Price *</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.price}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, price: e.target.value }))
                  }
                  required
                />
              </div>

              <div>
                <Label>Compare at Price</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.compare_at_price}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      compare_at_price: e.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <Label>Shipping Cost</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  disabled={form.is_free_shipping}
                  value={form.shipping_cost}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      shipping_cost: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-4 pt-4 border-t">
              {[
                ['Free Shipping', 'is_free_shipping'],
                ['Active', 'is_active'],
                ['Featured', 'is_featured'],
              ].map(([label, key]) => (
                <div
                  key={key}
                  className="flex items-center justify-between"
                >
                  <Label>{label}</Label>
                  <Switch
                    checked={(form as any)[key]}
                    onCheckedChange={(checked) =>
                      setForm((p) => ({ ...p, [key]: checked }))
                    }
                  />
                </div>
              ))}
            </div>

            {/* Images (placeholder) */}
            <div className="pt-4 border-t">
              <Label>Product Images</Label>
              <div className="mt-2 border-2 border-dashed rounded-lg p-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Image uploads wired after storage setup.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? 'Saving…'
                : product
                ? 'Update Product'
                : 'Create Product'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
