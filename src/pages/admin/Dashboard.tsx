import { useEffect } from 'react';
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
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

// Mock stats data
const stats = [
  {
    title: 'Total Revenue',
    value: '$12,543.00',
    change: '+12.5%',
    trend: 'up',
    icon: DollarSign,
  },
  {
    title: 'Orders',
    value: '156',
    change: '+8.2%',
    trend: 'up',
    icon: ShoppingCart,
  },
  {
    title: 'Products',
    value: '48',
    change: '+3',
    trend: 'up',
    icon: Package,
  },
  {
    title: 'Customers',
    value: '2,340',
    change: '+18.7%',
    trend: 'up',
    icon: Users,
  },
];

const recentOrders = [
  { id: 'GT-ABC123', customer: 'John Doe', total: 299.99, status: 'processing' },
  { id: 'GT-DEF456', customer: 'Jane Smith', total: 149.99, status: 'shipped' },
  { id: 'GT-GHI789', customer: 'Bob Wilson', total: 79.99, status: 'pending' },
  { id: 'GT-JKL012', customer: 'Alice Brown', total: 449.99, status: 'delivered' },
];

const statusColors: Record<string, string> = {
  pending: 'text-yellow-600 bg-yellow-100',
  processing: 'text-blue-600 bg-blue-100',
  shipped: 'text-purple-600 bg-purple-100',
  delivered: 'text-green-600 bg-green-100',
};

export default function AdminDashboard() {
  // 🔍 DEBUG: Check authentication and role
  useEffect(() => {
    const checkAuth = async () => {
      console.log('=== DASHBOARD AUTH DEBUG ===');
      
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

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className={`flex items-center text-xs ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                  )}
                  {stat.change} from last month
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
                href="/admin/products/new"
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
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between py-2"
                  >
                    <div>
                      <p className="font-medium">{order.id}</p>
                      <p className="text-sm text-muted-foreground">{order.customer}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${order.total.toFixed(2)}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
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
                Connect to your backend to view real-time analytics
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
