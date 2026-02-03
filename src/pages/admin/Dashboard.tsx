import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  MessageSquare,
  Star,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Stats {
  totalRevenue: number;
  orderCount: number;
  productCount: number;
  customerCount: number;
}

interface RecentOrder {
  id: string;
  order_number: string;
  grand_total: number;
  status: string;
  shipping_address: { full_name?: string } | null;
}

const statusColors: Record<string, string> = {
  pending: 'text-yellow-600 bg-yellow-100',
  processing: 'text-blue-600 bg-blue-100',
  shipped: 'text-purple-600 bg-purple-100',
  delivered: 'text-green-600 bg-green-100',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalRevenue: 0,
    orderCount: 0,
    productCount: 0,
    customerCount: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Load products count
        const { count: productCount } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true });

        // Load orders with totals
        const { data: orders } = await supabase
          .from('orders')
          .select('id, order_number, grand_total, status, shipping_address, created_at')
          .order('created_at', { ascending: false });

        const orderList = orders || [];
        const totalRevenue = orderList.reduce((acc, order) => acc + (order.grand_total || 0), 0);

        // Load unique customers count (from orders)
        const uniqueCustomers = new Set(orderList.map(o => o.shipping_address?.full_name)).size;

        setStats({
          totalRevenue,
          orderCount: orderList.length,
          productCount: productCount || 0,
          customerCount: uniqueCustomers,
        });

        // Recent orders (last 5)
        setRecentOrders(orderList.slice(0, 5).map(o => ({
          id: o.id,
          order_number: o.order_number || o.id.slice(0, 8),
          grand_total: o.grand_total || 0,
          status: o.status || 'pending',
          shipping_address: o.shipping_address,
        })));
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const statCards = [
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
    },
    {
      title: 'Orders',
      value: stats.orderCount.toString(),
      icon: ShoppingCart,
    },
    {
      title: 'Products',
      value: stats.productCount.toString(),
      icon: Package,
    },
    {
      title: 'Customers',
      value: stats.customerCount.toString(),
      icon: Users,
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? '...' : stat.value}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions & Recent Orders */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <a
                href="/admin/products"
                className="flex flex-col items-center justify-center p-4 rounded-lg border-2 border-dashed hover:border-primary hover:bg-muted/50 transition-colors"
              >
                <Package className="h-8 w-8 mb-2 text-muted-foreground" />
                <span className="text-sm font-medium">Add Product</span>
              </a>
              <a
                href="/admin/orders"
                className="flex flex-col items-center justify-center p-4 rounded-lg border-2 border-dashed hover:border-primary hover:bg-muted/50 transition-colors"
              >
                <ShoppingCart className="h-8 w-8 mb-2 text-muted-foreground" />
                <span className="text-sm font-medium">View Orders</span>
              </a>
              <a
                href="/admin/messages"
                className="flex flex-col items-center justify-center p-4 rounded-lg border-2 border-dashed hover:border-primary hover:bg-muted/50 transition-colors"
              >
                <MessageSquare className="h-8 w-8 mb-2 text-muted-foreground" />
                <span className="text-sm font-medium">Messages</span>
              </a>
              <a
                href="/admin/reviews"
                className="flex flex-col items-center justify-center p-4 rounded-lg border-2 border-dashed hover:border-primary hover:bg-muted/50 transition-colors"
              >
                <Star className="h-8 w-8 mb-2 text-muted-foreground" />
                <span className="text-sm font-medium">Reviews</span>
              </a>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-muted-foreground">Loading...</p>
              ) : recentOrders.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No orders yet</p>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between py-2"
                    >
                      <div>
                        <p className="font-medium">{order.order_number}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.shipping_address?.full_name || 'Guest'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${order.grand_total.toFixed(2)}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Performance Chart Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Sales Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground">
                Analytics will appear here as orders come in
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
