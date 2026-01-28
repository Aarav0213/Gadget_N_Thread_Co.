import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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
import { ordersApi } from '@/lib/api';
import type { Order } from '@/lib/api';

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
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingForm, setTrackingForm] = useState({ number: '', url: '' });

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await ordersApi.list();
      setOrders(data || []);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.shipping_address?.fullName || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await ordersApi.updateStatus(orderId, newStatus);
      toast({
        title: 'Order updated',
        description: `Order status changed to ${newStatus}.`,
      });
      loadOrders();
    } catch (error) {
      console.error('Failed to update order status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update order status.',
        variant: 'destructive',
      });
    }
  };

  const handleAddTracking = async () => {
    if (!trackingForm.number || !selectedOrder) return;
    
    try {
      await ordersApi.addTracking(selectedOrder.id, trackingForm.number, trackingForm.url || undefined);
      toast({
        title: 'Tracking added',
        description: 'Tracking information has been saved.',
      });
      setTrackingForm({ number: '', url: '' });
      setSelectedOrder(null);
      loadOrders();
    } catch (error) {
      console.error('Failed to add tracking:', error);
      toast({
        title: 'Error',
        description: 'Failed to add tracking information.',
        variant: 'destructive',
      });
    }
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
            {loading ? (
              <p className="text-muted-foreground">Loading orders...</p>
            ) : filteredOrders.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No orders found</p>
            ) : (
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
                        {order.order_number}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p>{order.shipping_address?.fullName || 'N/A'}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.shipping_address?.city}, {order.shipping_address?.state}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}
                      </TableCell>
                      <TableCell className="font-medium">
                        ${order.grand_total.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={order.status}
                          onValueChange={(value) => handleStatusChange(order.id, value)}
                        >
                          <SelectTrigger className="w-[130px]">
                            <Badge className={statusColors[order.status] || 'bg-gray-100 text-gray-800'}>
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
                        {new Date(order.created_at).toLocaleDateString()}
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
            )}
          </CardContent>
        </Card>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order {selectedOrder?.order_number}</DialogTitle>
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
                  {selectedOrder.items?.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      {item.product_image_url && (
                        <img
                          src={item.product_image_url}
                          alt={item.product_name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{item.product_name}</p>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity} × ${item.unit_price.toFixed(2)}
                        </p>
                      </div>
                      <p className="font-medium">${item.total_price.toFixed(2)}</p>
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
                    <span>{selectedOrder.shipping_total === 0 ? 'Free' : `$${selectedOrder.shipping_total.toFixed(2)}`}</span>
                  </div>
                  {selectedOrder.discount_total > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-${selectedOrder.discount_total.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span>${selectedOrder.grand_total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              {selectedOrder.shipping_address && (
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    Shipping Address
                  </h3>
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium text-foreground">{selectedOrder.shipping_address.fullName}</p>
                    <p>{selectedOrder.shipping_address.addressLine1}</p>
                    {selectedOrder.shipping_address.addressLine2 && (
                      <p>{selectedOrder.shipping_address.addressLine2}</p>
                    )}
                    <p>
                      {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} {selectedOrder.shipping_address.postalCode}
                    </p>
                    <p>{selectedOrder.shipping_address.country}</p>
                    {selectedOrder.shipping_address.phone && (
                      <p className="mt-1">Phone: {selectedOrder.shipping_address.phone}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Tracking */}
              <div className="border-t pt-4">
                <h3 className="font-medium mb-3">Tracking Information</h3>
                {selectedOrder.tracking_number ? (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="font-mono text-sm">{selectedOrder.tracking_number}</p>
                    {selectedOrder.tracking_url && (
                      <a
                        href={selectedOrder.tracking_url}
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
