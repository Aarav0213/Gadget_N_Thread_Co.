import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Store, Mail, CreditCard, Bell, Shield } from 'lucide-react';

export default function AdminSettings() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [storeSettings, setStoreSettings] = useState({
    storeName: 'Gadget & Thread Co.',
    storeEmail: 'support@gadgetthread.co',
    storePhone: '1-800-GADGET',
    storeAddress: '123 Tech Street, San Francisco, CA 94102',
    storeDescription: 'Your one-stop shop for gadgets and accessories.',
  });

  const [emailSettings, setEmailSettings] = useState({
    orderConfirmation: true,
    shippingUpdates: true,
    newMessageNotify: true,
    reviewNotify: true,
    dailyDigest: false,
  });

  const [paymentSettings, setPaymentSettings] = useState({
    stripeEnabled: false,
    stripePublicKey: '',
    paypalEnabled: false,
    paypalClientId: '',
  });

  // 🔍 DEBUG: Check authentication and role
  useEffect(() => {
    const checkAuth = async () => {
      console.log('=== SETTINGS AUTH DEBUG ===');
      
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

  const handleSaveStore = async () => {
    setIsSubmitting(true);
    
    try {
      console.log('Saving store settings:', storeSettings);
      
      // TODO: Implement actual save to Supabase
      // const { error } = await supabase
      //   .from('store_settings')
      //   .upsert(storeSettings);
      
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast({
        title: 'Settings saved',
        description: 'Store settings have been updated.',
      });
    } catch (error) {
      console.error('Failed to save store settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save store settings.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveEmail = async () => {
    setIsSubmitting(true);
    
    try {
      console.log('Saving email settings:', emailSettings);
      
      // TODO: Implement actual save to Supabase
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast({
        title: 'Settings saved',
        description: 'Email notification settings have been updated.',
      });
    } catch (error) {
      console.error('Failed to save email settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save email settings.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSavePayment = async () => {
    setIsSubmitting(true);
    
    try {
      console.log('Saving payment settings:', paymentSettings);
      
      // TODO: Implement actual save to Supabase
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast({
        title: 'Settings saved',
        description: 'Payment settings have been updated.',
      });
    } catch (error) {
      console.error('Failed to save payment settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save payment settings.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your store configuration</p>
        </div>

        <Tabs defaultValue="store" className="space-y-6">
          <TabsList>
            <TabsTrigger value="store" className="flex items-center gap-2">
              <Store className="h-4 w-4" />
              Store
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Payments
            </TabsTrigger>
          </TabsList>

          {/* Store Settings Tab */}
          <TabsContent value="store">
            <Card>
              <CardHeader>
                <CardTitle>Store Information</CardTitle>
                <CardDescription>
                  Basic information about your store that appears on the website.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="storeName">Store Name</Label>
                    <Input
                      id="storeName"
                      value={storeSettings.storeName}
                      onChange={(e) => setStoreSettings((prev) => ({ ...prev, storeName: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="storeEmail">Contact Email</Label>
                    <Input
                      id="storeEmail"
                      type="email"
                      value={storeSettings.storeEmail}
                      onChange={(e) => setStoreSettings((prev) => ({ ...prev, storeEmail: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="storePhone">Phone Number</Label>
                    <Input
                      id="storePhone"
                      value={storeSettings.storePhone}
                      onChange={(e) => setStoreSettings((prev) => ({ ...prev, storePhone: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="storeAddress">Address</Label>
                    <Input
                      id="storeAddress"
                      value={storeSettings.storeAddress}
                      onChange={(e) => setStoreSettings((prev) => ({ ...prev, storeAddress: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="storeDescription">Store Description</Label>
                  <Textarea
                    id="storeDescription"
                    value={storeSettings.storeDescription}
                    onChange={(e) => setStoreSettings((prev) => ({ ...prev, storeDescription: e.target.value }))}
                    rows={3}
                  />
                </div>

                <Button onClick={handleSaveStore} disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Email Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
                <CardDescription>
                  Configure which notifications you receive via email.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Order Confirmations</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive an email when a new order is placed
                    </p>
                  </div>
                  <Switch
                    checked={emailSettings.orderConfirmation}
                    onCheckedChange={(checked) =>
                      setEmailSettings((prev) => ({ ...prev, orderConfirmation: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Shipping Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified about shipping status changes
                    </p>
                  </div>
                  <Switch
                    checked={emailSettings.shippingUpdates}
                    onCheckedChange={(checked) =>
                      setEmailSettings((prev) => ({ ...prev, shippingUpdates: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>New Messages</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive an email when customers send messages
                    </p>
                  </div>
                  <Switch
                    checked={emailSettings.newMessageNotify}
                    onCheckedChange={(checked) =>
                      setEmailSettings((prev) => ({ ...prev, newMessageNotify: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>New Reviews</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when customers leave reviews
                    </p>
                  </div>
                  <Switch
                    checked={emailSettings.reviewNotify}
                    onCheckedChange={(checked) =>
                      setEmailSettings((prev) => ({ ...prev, reviewNotify: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Daily Digest</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive a daily summary of store activity
                    </p>
                  </div>
                  <Switch
                    checked={emailSettings.dailyDigest}
                    onCheckedChange={(checked) =>
                      setEmailSettings((prev) => ({ ...prev, dailyDigest: checked }))
                    }
                  />
                </div>

                <Button onClick={handleSaveEmail} disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Settings Tab */}
          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Payment Providers</CardTitle>
                <CardDescription>
                  Configure your payment gateway integrations. Add your API keys from your backend.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Security Notice</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Payment API keys should be configured in your backend environment, not stored in the frontend.
                    This settings page is for reference only.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#635BFF] rounded flex items-center justify-center">
                        <span className="text-white font-bold text-sm">S</span>
                      </div>
                      <div>
                        <p className="font-medium">Stripe</p>
                        <p className="text-sm text-muted-foreground">
                          Accept credit cards and digital wallets
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={paymentSettings.stripeEnabled}
                      onCheckedChange={(checked) =>
                        setPaymentSettings((prev) => ({ ...prev, stripeEnabled: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#003087] rounded flex items-center justify-center">
                        <span className="text-white font-bold text-sm">P</span>
                      </div>
                      <div>
                        <p className="font-medium">PayPal</p>
                        <p className="text-sm text-muted-foreground">
                          Accept PayPal payments
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={paymentSettings.paypalEnabled}
                      onCheckedChange={(checked) =>
                        setPaymentSettings((prev) => ({ ...prev, paypalEnabled: checked }))
                      }
                    />
                  </div>
                </div>

                <Button onClick={handleSavePayment} disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
