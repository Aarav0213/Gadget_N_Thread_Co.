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
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Plus, Pencil, Trash2, Copy, Ticket } from 'lucide-react';

interface DiscountCode {
  id: string;
  code: string;
  description: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  minimum_order_amount: number;
  usage_count: number;
  is_active: boolean;
  expires_at?: string;
}

export default function AdminDiscounts() {
  const { toast } = useToast();
  const [discounts, setDiscounts] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<DiscountCode | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    code: '',
    description: '',
    discount_type: 'percentage' as 'percentage' | 'fixed',
    discount_value: '',
    minimum_order_amount: '',
    is_active: true,
    expires_at: '',
  });

  useEffect(() => {
    loadDiscounts();
  }, []);

  const loadDiscounts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('discount_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDiscounts(data || []);
    } catch (error) {
      console.error('Failed to load discounts:', error);
      // Table might not exist yet, just show empty state
      setDiscounts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingDiscount(null);
    setForm({
      code: '',
      description: '',
      discount_type: 'percentage',
      discount_value: '',
      minimum_order_amount: '',
      is_active: true,
      expires_at: '',
    });
    setIsFormOpen(true);
  };

  const handleEdit = (discount: DiscountCode) => {
    setEditingDiscount(discount);
    setForm({
      code: discount.code,
      description: discount.description || '',
      discount_type: discount.discount_type,
      discount_value: discount.discount_value.toString(),
      minimum_order_amount: (discount.minimum_order_amount || 0).toString(),
      is_active: discount.is_active,
      expires_at: discount.expires_at || '',
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const discountData = {
        code: form.code.toUpperCase(),
        description: form.description,
        discount_type: form.discount_type,
        discount_value: parseFloat(form.discount_value),
        minimum_order_amount: parseFloat(form.minimum_order_amount) || 0,
        is_active: form.is_active,
        expires_at: form.expires_at || null,
      };

      if (editingDiscount) {
        const { error } = await supabase
          .from('discount_codes')
          .update(discountData)
          .eq('id', editingDiscount.id);

        if (error) throw error;

        toast({
          title: 'Discount updated',
          description: `${form.code.toUpperCase()} has been updated.`,
        });
      } else {
        const { error } = await supabase
          .from('discount_codes')
          .insert({ ...discountData, usage_count: 0 });

        if (error) throw error;

        toast({
          title: 'Discount created',
          description: `${form.code.toUpperCase()} has been created.`,
        });
      }

      setIsFormOpen(false);
      loadDiscounts();
    } catch (error) {
      console.error('Failed to save discount:', error);
      toast({
        title: 'Error',
        description: 'Failed to save discount code.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this discount code?')) return;

    try {
      const { error } = await supabase
        .from('discount_codes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Discount deleted',
        description: 'The discount code has been removed.',
      });
      loadDiscounts();
    } catch (error) {
      console.error('Failed to delete discount:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete discount code.',
        variant: 'destructive',
      });
    }
  };

  const handleToggleActive = async (discount: DiscountCode) => {
    try {
      const { error } = await supabase
        .from('discount_codes')
        .update({ is_active: !discount.is_active })
        .eq('id', discount.id);

      if (error) throw error;
      loadDiscounts();
    } catch (error) {
      console.error('Failed to toggle discount:', error);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: 'Copied!',
      description: `${code} copied to clipboard.`,
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Discount Codes</h1>
            <p className="text-muted-foreground">Manage promotional discount codes</p>
          </div>
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Create Discount
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Ticket className="h-8 w-8 text-primary" />
                <div>
                  <div className="text-2xl font-bold">{discounts.length}</div>
                  <p className="text-sm text-muted-foreground">Total Codes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {discounts.filter((d) => d.is_active).length}
              </div>
              <p className="text-sm text-muted-foreground">Active Codes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {discounts.reduce((acc, d) => acc + (d.usage_count || 0), 0)}
              </div>
              <p className="text-sm text-muted-foreground">Total Uses</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Discount Codes</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-muted-foreground">Loading discounts...</p>
            ) : discounts.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No discount codes yet. Create your first one!</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Minimum Order</TableHead>
                    <TableHead>Uses</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[100px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {discounts.map((discount) => (
                    <TableRow key={discount.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <code className="px-2 py-1 bg-muted rounded font-mono text-sm">
                            {discount.code}
                          </code>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => copyCode(discount.code)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        {discount.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {discount.description}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {discount.discount_type === 'percentage'
                            ? `${discount.discount_value}%`
                            : `$${discount.discount_value}`}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {discount.minimum_order_amount > 0
                          ? `$${discount.minimum_order_amount}`
                          : 'None'}
                      </TableCell>
                      <TableCell>{discount.usage_count || 0}</TableCell>
                      <TableCell>
                        <Switch
                          checked={discount.is_active}
                          onCheckedChange={() => handleToggleActive(discount)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(discount)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => handleDelete(discount.id)}
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
              {editingDiscount ? 'Edit Discount Code' : 'Create Discount Code'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="code">Code *</Label>
              <Input
                id="code"
                value={form.code}
                onChange={(e) => setForm((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))}
                placeholder="SAVE10"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="10% off your order"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="discount_type">Discount Type</Label>
                <Select
                  value={form.discount_type}
                  onValueChange={(value: 'percentage' | 'fixed') =>
                    setForm((prev) => ({ ...prev, discount_type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="discount_value">Value *</Label>
                <Input
                  id="discount_value"
                  type="number"
                  min="0"
                  step={form.discount_type === 'percentage' ? '1' : '0.01'}
                  value={form.discount_value}
                  onChange={(e) => setForm((prev) => ({ ...prev, discount_value: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="minimum_order_amount">Minimum Order Amount</Label>
              <Input
                id="minimum_order_amount"
                type="number"
                min="0"
                step="0.01"
                value={form.minimum_order_amount}
                onChange={(e) => setForm((prev) => ({ ...prev, minimum_order_amount: e.target.value }))}
                placeholder="0"
              />
            </div>

            <div>
              <Label htmlFor="expires_at">Expiration Date (optional)</Label>
              <Input
                id="expires_at"
                type="date"
                value={form.expires_at}
                onChange={(e) => setForm((prev) => ({ ...prev, expires_at: e.target.value }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="is_active">Active</Label>
                <p className="text-sm text-muted-foreground">Enable this discount code</p>
              </div>
              <Switch
                id="is_active"
                checked={form.is_active}
                onCheckedChange={(checked) => setForm((prev) => ({ ...prev, is_active: checked }))}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : editingDiscount ? 'Update Discount' : 'Create Discount'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
