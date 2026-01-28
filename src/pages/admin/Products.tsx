import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Plus, Search, MoreHorizontal, Pencil, Trash2, Eye } from 'lucide-react'
import { ProductFormDialog } from '@/components/admin/ProductFormDialog'
import { productsApi } from '@/lib/api'
import type { Product } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'

export default function AdminProducts() {
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const res = await productsApi.list()
      setProducts(res || [])
    } catch (err) {
      console.error('Failed to load products', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAdd = () => {
    setEditingProduct(null)
    setIsFormOpen(true)
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setIsFormOpen(true)
  }

  const handleDelete = async (product: Product) => {
    if (!confirm(`Are you sure you want to delete "${product.name}"?`)) return
    
    try {
      await productsApi.delete(product.id)
      toast({
        title: 'Product deleted',
        description: `${product.name} has been deleted.`,
      })
      loadProducts()
    } catch (err) {
      console.error('Failed to delete product', err)
      toast({
        title: 'Error',
        description: 'Failed to delete product.',
        variant: 'destructive',
      })
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Products</h1>
            <p className="text-muted-foreground">
              Manage your product catalog
            </p>
          </div>
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>

        {/* Table */}
        <Card>
          <CardHeader>
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardHeader>

          <CardContent>
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading products…</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Shipping</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[70px]" />
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      {/* Product */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-muted rounded overflow-hidden">
                            {product.images?.[0]?.image_url && (
                              <img
                                src={product.images[0].image_url}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {product.review_count ?? 0} reviews
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Category */}
                      <TableCell>
                        {product.category?.name || 'Uncategorized'}
                      </TableCell>

                      {/* Price */}
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            ${product.price.toFixed(2)}
                          </p>
                          {product.compare_at_price && (
                            <p className="text-sm text-muted-foreground line-through">
                              ${product.compare_at_price.toFixed(2)}
                            </p>
                          )}
                        </div>
                      </TableCell>

                      {/* Shipping */}
                      <TableCell>
                        {product.is_free_shipping ? (
                          <Badge variant="secondary">Free</Badge>
                        ) : (
                          <span>${(product.shipping_cost ?? 0).toFixed(2)}</span>
                        )}
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Badge
                          variant={product.is_active ? 'default' : 'secondary'}
                        >
                          {product.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>

                      {/* Actions */}
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <a
                                href={`/products/${product.slug}`}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </a>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => handleEdit(product)}
                            >
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>

                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => handleDelete(product)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <ProductFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        product={editingProduct}
        onSuccess={loadProducts}
      />
    </AdminLayout>
  )
}
