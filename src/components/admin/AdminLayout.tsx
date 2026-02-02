import { ReactNode, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/lib/supabase';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Star,
  MessageSquare,
  Ticket,
  Settings,
  LogOut,
  ArrowLeft,
  AlertCircle,
} from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: FolderTree },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/reviews', label: 'Reviews', icon: Star },
  { href: '/admin/messages', label: 'Messages', icon: MessageSquare },
  { href: '/admin/discounts', label: 'Discount Codes', icon: Ticket },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  // 🔍 ADMIN VERIFICATION
  useEffect(() => {
    const checkAdminAccess = async () => {
      console.log('=== ADMIN LAYOUT: CHECKING ACCESS ===');
      
      try {
        // Step 1: Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        console.log('User ID:', user?.id);
        console.log('User Email:', user?.email);
        console.log('User Error:', userError);

        if (!user) {
          console.error('❌ NO USER LOGGED IN - Redirecting to login');
          setIsAdmin(false);
          setIsChecking(false);
          navigate('/login');
          return;
        }

        // Step 2: Check user role
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        console.log('Role Data:', roleData);
        console.log('Role Error:', roleError);

        // Step 3: Verify admin access
        const { data: isAdminData, error: isAdminError } = await supabase.rpc('is_admin');
        console.log('is_admin() returns:', isAdminData);
        console.log('is_admin() error:', isAdminError);

        if (roleData?.role === 'admin' || isAdminData === true) {
          console.log('✅ ADMIN ACCESS GRANTED');
          setIsAdmin(true);
        } else {
          console.error('❌ NOT AN ADMIN - Redirecting to home');
          setIsAdmin(false);
          // Redirect non-admin users to home page
          navigate('/');
        }
      } catch (error) {
        console.error('Error checking admin access:', error);
        setIsAdmin(false);
        navigate('/');
      } finally {
        setIsChecking(false);
        console.log('=== END ADMIN ACCESS CHECK ===');
      }
    };

    checkAdminAccess();
  }, [navigate]);

  const handleLogout = () => {
    console.log('Admin logging out');
    logout();
    navigate('/');
  };

  // Show loading state while checking admin access
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Show error if not admin (shouldn't reach here due to redirect, but safety check)
  if (isAdmin === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground mb-4">You don't have permission to access this area.</p>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  // Render admin layout if user is verified as admin
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-background">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center gap-2 border-b px-6 py-4">
            <Package className="h-6 w-6" />
            <span className="font-bold">Admin Panel</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href ||
                (item.href !== '/admin' && location.pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t p-3 space-y-2">
            <Link to="/">
              <Button variant="ghost" className="w-full justify-start">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Store
              </Button>
            </Link>
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 min-h-screen p-8">
        {children}
      </main>
    </div>
  );
}
