import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase'
import { productsApi } from '@/lib/api'
import type { Product } from '@/lib/api'
import { Plus, X } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
}

interface ImageInput {
  id: string
  url: string
  alt_text: string
  is_primary: boolean
}

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
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  
  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    compare_at_price: '',
    shipping_cost: '',
    category_id: '',
    is_free_shipping: false,
    is_active: true,
    is_featured: false,
  })

  const [imageInputs, setImageInputs] = useState<ImageInput[]>([
    { id: crypto.randomUUID(), url: '', alt_text: '', is_primary: true }
  ])

  /* ------------------ Fetch Categories ------------------ */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true)
        console.log('Fetching categories from Supabase...')
        
        const { data, error } = await supabase
          .from('categories')
          .select('id, name, slug, description')
          .eq('is_active', true)
          .order('display_order', { ascending: true })

        if (error) {
          console.error('Error fetching categories:', error)
          throw error
        }

        console.log('Categories loaded:', data?.length || 0)
        setCategories(data || [])
      } catch (error) {
        console.error('Failed to load categories:', error)
        toast({
          title: 'Error',
          description: 'Failed to load categories.',
          variant: 'destructive',
        })
      } finally {
        setLoadingCategories(false)
      }
    }

    if (open) {
      fetchCategories()
    }
  }, [open, toast])

  /* ------------------ Populate form ------------------ */
  useEffect(() => {
    if (product) {
      console.log('Populating form with product:', product.name)
      
      setForm({
        name: product.name,
        slug: product.slug,
        description: product.description ?? '',
        price: product.price.toString(),
        compare_at_price: product.compare_at_price?.toString() ?? '',
        shipping_cost: product.shipping_cost?.toString() ?? '0',
        category_id: product.category_id ?? '',
        is_free_shipping: product.is_free_shipping,
        is_active: product.is_active,
        is_featured: product.is_featured,
      })

      // Load existing images if editing
      if (product.images && product.images.length > 0) {
        const existingImages = product.images.map((img, index) => ({
          id: img.id || crypto.randomUUID(),
          url: img.image_url,
          alt_text: img.alt_text || '',
          is_primary: img.is_primary || index === 0,
        }))
        setImageInputs(existingImages)
      }
    } else {
      console.log('Resetting form for new product')
      setForm({
        name: '',
        slug: '',
        description: '',
        price: '',
        compare_at_price: '',
        shipping_cost: '',
        category_id: '',
        is_free_shipping: false,
        is_active: true,
        is_featured: false,
      })
      setImageInputs([
        { id: crypto.randomUUID(), url: '', alt_text: '', is_primary: true }
      ])
    }
  }, [product, open])

  /* ------------------ Image Handlers ------------------ */
  const addImageInput = () => {
    setImageInputs((prev) => [
      ...prev,
      { 
        id: crypto.randomUUID(), 
        url: '', 
        alt_text: '', 
        is_primary: false 
      }
    ])
  }

  const removeImageInput = (id: string) => {
    if (imageInputs.length === 1) {
      toast({
        title: 'Cannot remove',
        description: 'At least one image is required.',
        variant: 'destructive',
      })
      return
    }
    setImageInputs((prev) => prev.filter((img) => img.id !== id))
  }

  const updateImageInput = (id: string, field: keyof ImageInput, value: string | boolean) => {
    setImageInputs((prev) =>
      prev.map((img) => {
        if (img.id === id) {
          // If setting this as primary, unset others
          if (field === 'is_primary' && value === true) {
            return { ...img, [field]: value }
          }
          return { ...img, [field]: value }
        } else if (field === 'is_primary' && value === true) {
          // Unset primary for other images
          return { ...img, is_primary: false }
        }
        return img
      })
    )
  }

  /* ------------------ Submit ------------------ */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!form.name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Product name is required.',
        variant: 'destructive',
      })
      return
    }

    if (!form.slug.trim()) {
      toast({
        title: 'Validation Error',
        description: 'URL slug is required.',
        variant: 'destructive',
      })
      return
    }

    if (!form.price || Number(form.price) <= 0) {
      toast({
        title: 'Validation Error',
        description: 'Price must be greater than 0.',
        variant: 'destructive',
      })
      return
    }

    if (!form.category_id) {
      toast({
        title: 'Validation Error',
        description: 'Please select a category.',
        variant: 'destructive',
      })
      return
    }

    // Validate at least one image with URL
    const validImages = imageInputs.filter((img) => img.url.trim() !== '')
    if (validImages.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'At least one product image is required.',
        variant: 'destructive',
      })
      return
    }

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
        category_id: form.category_id,
        is_free_shipping: form.is_free_shipping,
        is_active: form.is_active,
        is_featured: form.is_featured,
      }

      console.log('Submitting product payload:', payload)

      let productId: string

      if (product) {
        // Update existing product
        console.log('Updating product:', product.id)
        await productsApi.update(product.id, payload)
        productId = product.id

        // Delete existing images and re-insert
        const { error: deleteError } = await supabase
          .from('product_images')
          .delete()
          .eq('product_id', productId)

        if (deleteError) {
          console.error('Error deleting old images:', deleteError)
        }
      } else {
        // Create new product
        console.log('Creating new product')
        const createdProduct = await productsApi.create(payload)
        productId = createdProduct.id
      }

      // Insert images into product_images table
      const imageRecords = validImages.map((img, index) => ({
        id: crypto.randomUUID(),
        product_id: productId,
        image_url: img.url.trim(),
        alt_text: img.alt_text.trim() || null,
        display_order: index + 1,
        is_primary: img.is_primary,
        created_at: new Date().toISOString(),
      }))

      console.log('Inserting product images:', imageRecords.length)
      const { error: imagesError } = await supabase
        .from('product_images')
        .insert(imageRecords)

      if (imagesError) {
        console.error('Error inserting images:', imagesError)
        toast({
          title: 'Warning',
          description: 'Product saved but some images failed to upload.',
          variant: 'destructive',
        })
      } else {
        toast({
          title: product ? 'Product updated' : 'Product created',
          description: `${payload.name} saved successfully with ${imageRecords.length} image(s).`,
        })
      }

      onOpenChange(false)
      onSuccess?.()
    } catch (err: any) {
      console.error('Failed to save product:', err)
      toast({
        title: 'Error',
        description: err?.message || 'Failed to save product. Check console for details.',
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
                <Label htmlFor="product-name">Product Name *</Label>
                <Input
                  id="product-name"
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                      slug: generateSlug(e.target.value),
                    }))
                  }
                  required
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <Label htmlFor="product-slug">URL Slug *</Label>
                <Input
                  id="product-slug"
                  value={form.slug}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, slug: e.target.value }))
                  }
                  required
                  placeholder="product-slug"
                />
              </div>
            </div>

            {/* Category Dropdown */}
            <div>
              <Label htmlFor="product-category">Category *</Label>
              <Select
                value={form.category_id}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, category_id: value }))
                }
                disabled={loadingCategories}
              >
                <SelectTrigger id="product-category">
                  <SelectValue placeholder={loadingCategories ? 'Loading categories...' : 'Select a category'} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {categories.length === 0 && !loadingCategories && (
                <p className="text-sm text-muted-foreground mt-1">
                  No categories available. Please create categories first.
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="product-description">Description</Label>
              <Textarea
                id="product-description"
                rows={4}
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Enter product description"
              />
            </div>

            {/* Pricing */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="product-price">Price *</Label>
                <Input
                  id="product-price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.price}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, price: e.target.value }))
                  }
                  required
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="product-compare-price">Compare at Price</Label>
                <Input
                  id="product-compare-price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.compare_at_price}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      compare_at_price: e.target.value,
                    }))
                  }
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="product-shipping">Shipping Cost</Label>
                <Input
                  id="product-shipping"
                  type="number"
                  step="0.01"
                  min="0"
                  disabled={form.is_free_shipping}
                  value={form.shipping_cost}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      shipping_cost: e.target.value,
                    }))
                  }
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Product Images */}
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between mb-3">
                <Label>Product Images *</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addImageInput}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Image
                </Button>
              </div>
              
              <div className="space-y-3">
                {imageInputs.map((img, index) => (
                  <div key={img.id} className="flex gap-2 items-start p-3 border rounded-lg">
                    <div className="flex-1 space-y-2">
                      <Input
                        placeholder="Image URL *"
                        value={img.url}
                        onChange={(e) => updateImageInput(img.id, 'url', e.target.value)}
                        required
                      />
                      <Input
                        placeholder="Alt text (optional)"
                        value={img.alt_text}
                        onChange={(e) => updateImageInput(img.id, 'alt_text', e.target.value)}
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`primary-${img.id}`}
                          checked={img.is_primary}
                          onChange={(e) => updateImageInput(img.id, 'is_primary', e.target.checked)}
                          className="rounded"
                        />
                        <Label htmlFor={`primary-${img.id}`} className="text-sm font-normal">
                          Primary image
                        </Label>
                      </div>
                    </div>
                    {imageInputs.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeImageInput(img.id)}
                        className="text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <Label htmlFor="free-shipping">Free Shipping</Label>
                <Switch
                  id="free-shipping"
                  checked={form.is_free_shipping}
                  onCheckedChange={(checked) =>
                    setForm((prev) => ({ ...prev, is_free_shipping: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="product-active">Active</Label>
                <Switch
                  id="product-active"
                  checked={form.is_active}
                  onCheckedChange={(checked) =>
                    setForm((prev) => ({ ...prev, is_active: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="product-featured">Featured</Label>
                <Switch
                  id="product-featured"
                  checked={form.is_featured}
                  onCheckedChange={(checked) =>
                    setForm((prev) => ({ ...prev, is_featured: checked }))
                  }
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
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
