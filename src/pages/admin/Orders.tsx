import { useState } from 'react';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Search, Eye, Package, Truck } from 'lucide-react';
import type { Order } from '@/lib/api';

// Mock orders
const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'GT-ABC123',
    status: 'processing',
    subtotal: 279.99,
    shippingTotal: 10.00,
    discountTotal: 0,
    grandTotal: 289.99,
    createdAt: '2024-01-22T10:30:00Z',
    items: [
      { id: '1', productName: 'Wireless Headphones Pro', productImageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100', quantity: 1, unitPrice: 199.99, totalPrice: 199.99 },
      { id: '2', productName: 'USB-C Hub', quantity: 2, unitPrice: 40.00, totalPrice: 80.00 },
    ],
    shippingAddress: {
      fullName: 'John Doe',
      addressLine1: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94102',
      country: 'United States',
      phone: '555-0123',
    },
  },
  {
    id: '2',
    orderNumber: 'GT-DEF456',
    status: 'shipped',
    subtotal: 149.99,
    shippingTotal: 0,
    discountTotal: 15.00,
    grandTotal: 134.99,
    trackingNumber: '1Z999AA10123456784',
    trackingUrl: 'https://ups.com/track/1Z999AA10123456784',
    createdAt: '2024-01-21T14:00:00Z',
    items: [
      { id: '3', productName: 'Bluetooth Speaker', productImageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=100', quantity: 1, unitPrice: 149.99, totalPrice: 149.99 },
    ],
    shippingAddress: {
      fullName: 'Jane Smith',
      addressLine1: '456 Oak Ave',
      addressLine2: 'Apt 2B',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'United States',
    },
  },
  {
    id: '3',
    orderNumber: 'GT-GHI789',
    status: 'pending',
    subtotal: 79.99,
    shippingTotal: 5.99,
    discountTotal: 0,
    grandTotal: 85.98,
    createdAt: '2024-01-22T16:45:00Z',
    items: [
      { id: '4', productName: 'Wireless Charger', quantity: 1, unitPrice: 49.99, totalPrice: 49.99 },
      { id: '5', productName: 'Phone Stand', quantity: 1, unitPrice: 30.00, totalPrice: 30.00 },
    ],
    shippingAddress: {
      fullName: 'Bob Wilson',
      addressLine1: '789 Pine Blvd',
      city: 'Los Angeles',
      state: 'CA',
      postalCode: '90001',
      country: 'United States',
    },
  },
];

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800',
};

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'refunded', label: 'Refunded' },
];

export default function AdminOrders() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingForm, setTrackingForm] = useState({ number: '', url: '' });

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.shippingAddress.fullName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (orderId: string, newStatus: string) => {
    toast({
      title: 'Order updated',
      description: `Order status changed to ${newStatus}.`,
    });
  };

  const handleAddTracking = () => {
    if (!trackingForm.number) return;
    
    toast({
      title: 'Tracking added',
      description: 'Tracking information has been saved.',
    });
    
    setTrackingForm({ number: '', url: '' });
    setSelectedOrder(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground">Manage and track customer orders</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {statusOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      {order.orderNumber}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p>{order.shippingAddress.fullName}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.shippingAddress.city}, {order.shippingAddress.state}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </TableCell>
                    <TableCell className="font-medium">
                      ${order.grandTotal.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={order.status}
                        onValueChange={(value) => handleStatusChange(order.id, value)}
                      >
                        <SelectTrigger className="w-[130px]">
                          <Badge className={statusColors[order.status]}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order {selectedOrder?.orderNumber}</DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Items */}
              <div>
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Order Items
                </h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      {item.productImageUrl && (
                        <img
                          src={item.productImageUrl}
                          alt={item.productName}
                          className="w-12 h-12 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity} × ${item.unitPrice.toFixed(2)}
                        </p>
                      </div>
                      <p className="font-medium">${item.totalPrice.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t pt-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{selectedOrder.shippingTotal === 0 ? 'Free' : `$${selectedOrder.shippingTotal.toFixed(2)}`}</span>
                  </div>
                  {selectedOrder.discountTotal > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-${selectedOrder.discountTotal.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span>${selectedOrder.grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="border-t pt-4">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  Shipping Address
                </h3>
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">{selectedOrder.shippingAddress.fullName}</p>
                  <p>{selectedOrder.shippingAddress.addressLine1}</p>
                  {selectedOrder.shippingAddress.addressLine2 && (
                    <p>{selectedOrder.shippingAddress.addressLine2}</p>
                  )}
                  <p>
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postalCode}
                  </p>
                  <p>{selectedOrder.shippingAddress.country}</p>
                  {selectedOrder.shippingAddress.phone && (
                    <p className="mt-1">Phone: {selectedOrder.shippingAddress.phone}</p>
                  )}
                </div>
              </div>

              {/* Tracking */}
              <div className="border-t pt-4">
                <h3 className="font-medium mb-3">Tracking Information</h3>
                {selectedOrder.trackingNumber ? (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="font-mono text-sm">{selectedOrder.trackingNumber}</p>
                    {selectedOrder.trackingUrl && (
                      <a
                        href={selectedOrder.trackingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        Track Package →
                      </a>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="trackingNumber">Tracking Number</Label>
                      <Input
                        id="trackingNumber"
                        value={trackingForm.number}
                        onChange={(e) => setTrackingForm(prev => ({ ...prev, number: e.target.value }))}
                        placeholder="Enter tracking number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="trackingUrl">Tracking URL (optional)</Label>
                      <Input
                        id="trackingUrl"
                        value={trackingForm.url}
                        onChange={(e) => setTrackingForm(prev => ({ ...prev, url: e.target.value }))}
                        placeholder="https://..."
                      />
                    </div>
                    <Button onClick={handleAddTracking} disabled={!trackingForm.number}>
                      Add Tracking
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
