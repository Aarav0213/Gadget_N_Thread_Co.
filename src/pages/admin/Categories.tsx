import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { categoriesApi } from '@/lib/api';
import type { Category } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, GripVertical } from 'lucide-react';

export default function AdminCategories() {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    is_active: true,
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await categoriesApi.list();
      setCategories(data || []);
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingCategory(null);
    setForm({ name: '', slug: '', description: '', is_active: true });
    setIsFormOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setForm({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      is_active: category.is_active,
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    
    try {
      await categoriesApi.delete(id);
      toast({
        title: 'Category deleted',
        description: 'The category has been deleted.',
      });
      loadCategories();
    } catch (error) {
      console.error('Failed to delete category:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete category.',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (editingCategory) {
        await categoriesApi.update(editingCategory.id, form);
      } else {
        await categoriesApi.create(form);
      }
      
      toast({
        title: editingCategory ? 'Category updated' : 'Category created',
        description: `${form.name} has been ${editingCategory ? 'updated' : 'created'} successfully.`,
      });
      
      setIsFormOpen(false);
      loadCategories();
    } catch (error) {
      console.error('Failed to save category:', error);
      toast({
        title: 'Error',
        description: 'Failed to save category.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Categories</h1>
            <p className="text-muted-foreground">Organize your products into categories</p>
          </div>
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Categories</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-muted-foreground">Loading categories...</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[100px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {category.image_url && (
                            <div className="w-10 h-10 bg-muted rounded overflow-hidden">
                              <img
                                src={category.image_url}
                                alt={category.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div>
                            <p className="font-medium">{category.name}</p>
                            {category.description && (
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {category.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {category.slug}
                      </TableCell>
                      <TableCell>--</TableCell>
                      <TableCell>
                        <Badge variant={category.is_active ? 'default' : 'secondary'}>
                          {category.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(category)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-destructive"
                            onClick={() => handleDelete(category.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Category Name *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm(prev => ({
                  ...prev,
                  name: e.target.value,
                  slug: generateSlug(e.target.value),
                }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="slug">URL Slug *</Label>
              <Input
                id="slug"
                value={form.slug}
                onChange={(e) => setForm(prev => ({ ...prev, slug: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="is_active">Active</Label>
                <p className="text-sm text-muted-foreground">Show this category in the store</p>
              </div>
              <Switch
                id="is_active"
                checked={form.is_active}
                onCheckedChange={(checked) => setForm(prev => ({ ...prev, is_active: checked }))}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
