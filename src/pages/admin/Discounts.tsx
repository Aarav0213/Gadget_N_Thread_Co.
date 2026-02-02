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
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minimumOrderAmount: number;
  usageCount: number;
  isActive: boolean;
  expiresAt?: string;
}

const mockDiscounts: DiscountCode[] = [
  {
    id: '1',
    code: 'SAVE10',
    description: '10% off your order',
    discountType: 'percentage',
    discountValue: 10,
    minimumOrderAmount: 50,
    usageCount: 145,
    isActive: true,
  },
  {
    id: '2',
    code: 'WELCOME20',
    description: '$20 off for new customers',
    discountType: 'fixed',
    discountValue: 20,
    minimumOrderAmount: 100,
    usageCount: 89,
    isActive: true,
    expiresAt: '2024-03-01',
  },
  {
    id: '3',
    code: 'FREESHIP',
    description: 'Free shipping on orders over $75',
    discountType: 'fixed',
    discountValue: 10,
    minimumOrderAmount: 75,
    usageCount: 234,
    isActive: false,
  },
];

export default function AdminDiscounts() {
  const { toast } = useToast();
  const [discounts, setDiscounts] = useState(mockDiscounts);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<DiscountCode | null>(null);
  const [form, setForm] = useState({
    code: '',
    description: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: '',
    minimumOrderAmount: '',
    isActive: true,
    expiresAt: '',
  });

  // 🔍 DEBUG: Check authentication and role
  useEffect(() => {
    const checkAuth = async () => {
      console.log('=== DISCOUNTS AUTH DEBUG ===');
      
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Current user:', user?.email);
      console.log('User ID:', user?.id);
      
      if (user?.id) {
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();
        
        console.log('User role:', roleData?.role);
        console.log('Role error:', roleError);
        
        const { data: isAdminData } = await supabase.rpc('is_admin');
        console.log('is_admin() returns:', isAdminData);
      }
      
      console.log('=== END AUTH DEBUG ===');
    };
    
    checkAuth();
  }, []);

  const handleAdd = () => {
    console.log('Opening form to create new discount');
    setEditingDiscount(null);
    setForm({
      code: '',
      description: '',
      discountType: 'percentage',
      discountValue: '',
      minimumOrderAmount: '',
      isActive: true,
      expiresAt: '',
    });
    setIsFormOpen(true);
  };

  const handleEdit = (discount: DiscountCode) => {
    console.log('Opening form to edit discount:', discount.code);
    setEditingDiscount(discount);
    setForm({
      code: discount.code,
      description: discount.description,
      discountType: discount.discountType,
      discountValue: discount.discountValue.toString(),
      minimumOrderAmount: discount.minimumOrderAmount.toString(),
      isActive: discount.isActive,
      expiresAt: discount.expiresAt || '',
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Submitting discount form:', form);
    
    if (editingDiscount) {
      setDiscounts((prev) => prev.map((d) =>
        d.id === editingDiscount.id
          ? {
              ...d,
              code: form.code.toUpperCase(),
              description: form.description,
              discountType: form.discountType,
              discountValue: parseFloat(form.discountValue),
              minimumOrderAmount: parseFloat(form.minimumOrderAmount) || 0,
              isActive: form.isActive,
              expiresAt: form.expiresAt || undefined,
            }
          : d
      ));
      toast({
        title: 'Discount updated',
        description: `${form.code.toUpperCase()} has been updated.`,
      });
    } else {
      const newDiscount: DiscountCode = {
        id: Date.now().toString(),
        code: form.code.toUpperCase(),
        description: form.description,
        discountType: form.discountType,
        discountValue: parseFloat(form.discountValue),
        minimumOrderAmount: parseFloat(form.minimumOrderAmount) || 0,
        usageCount: 0,
        isActive: form.isActive,
        expiresAt: form.expiresAt || undefined,
      };
      setDiscounts((prev) => [...prev, newDiscount]);
      toast({
        title: 'Discount created',
        description: `${form.code.toUpperCase()} has been created.`,
      });
    }
    
    setIsFormOpen(false);
  };

  const handleDelete = (id: string) => {
    const discount = discounts.find((d) => d.id === id);
    console.log('Deleting discount:', discount?.code);
    
    setDiscounts((prev) => prev.filter((d) => d.id !== id));
    toast({
      title: 'Discount deleted',
      description: 'The discount code has been removed.',
    });
  };

  const handleToggleActive = (id: string) => {
    const discount = discounts.find((d) => d.id === id);
    console.log('Toggling active status for:', discount?.code);
    
    setDiscounts((prev) => prev.map((d) =>
      d.id === id ? { ...d, isActive: !d.isActive } : d
    ));
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
                {discounts.filter((d) => d.isActive).length}
              </div>
              <p className="text-sm text-muted-foreground">Active Codes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {discounts.reduce((acc, d) => acc + d.usageCount, 0)}
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
                      <p className="text-sm text-muted-foreground mt-1">
                        {discount.description}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {discount.discountType === 'percentage'
                          ? `${discount.discountValue}%`
                          : `$${discount.discountValue}`}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {discount.minimumOrderAmount > 0
                        ? `$${discount.minimumOrderAmount}`
                        : 'None'}
                    </TableCell>
                    <TableCell>{discount.usageCount}</TableCell>
                    <TableCell>
                      <Switch
                        checked={discount.isActive}
                        onCheckedChange={() => handleToggleActive(discount.id)}
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
                <Label htmlFor="discountType">Discount Type</Label>
                <Select
                  value={form.discountType}
                  onValueChange={(value: 'percentage' | 'fixed') =>
                    setForm((prev) => ({ ...prev, discountType: value }))
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
                <Label htmlFor="discountValue">Value *</Label>
                <Input
                  id="discountValue"
                  type="number"
                  min="0"
                  step={form.discountType === 'percentage' ? '1' : '0.01'}
                  value={form.discountValue}
                  onChange={(e) => setForm((prev) => ({ ...prev, discountValue: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="minimumOrderAmount">Minimum Order Amount</Label>
              <Input
                id="minimumOrderAmount"
                type="number"
                min="0"
                step="0.01"
                value={form.minimumOrderAmount}
                onChange={(e) => setForm((prev) => ({ ...prev, minimumOrderAmount: e.target.value }))}
                placeholder="0"
              />
            </div>

            <div>
              <Label htmlFor="expiresAt">Expiration Date (optional)</Label>
              <Input
                id="expiresAt"
                type="date"
                value={form.expiresAt}
                onChange={(e) => setForm((prev) => ({ ...prev, expiresAt: e.target.value }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="isActive">Active</Label>
                <p className="text-sm text-muted-foreground">Enable this discount code</p>
              </div>
              <Switch
                id="isActive"
                checked={form.isActive}
                onCheckedChange={(checked) => setForm((prev) => ({ ...prev, isActive: checked }))}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingDiscount ? 'Update Discount' : 'Create Discount'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
