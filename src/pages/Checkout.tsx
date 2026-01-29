import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authstore';
import { useToast } from '@/hooks/use-toast';
import { ShoppingBag, CreditCard, Truck } from 'lucide-react';

interface ShippingAddress {
  full_name: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
}

export default function Checkout() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { items, getSubtotal, getShippingTotal, getTotal, discountCode, discountAmount, clearCart } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    full_name: user?.full_name || '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'United States',
    phone: '',
  });

  const [customerNotes, setCustomerNotes] = useState('');

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">Add items to your cart before checking out.</p>
          <Button onClick={() => navigate('/products')}>Browse Products</Button>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-2">Please sign in to checkout</h1>
          <p className="text-muted-foreground mb-6">You need an account to complete your purchase.</p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => navigate('/login')}>Sign In</Button>
            <Button variant="outline" onClick={() => navigate('/register')}>Create Account</Button>
          </div>
        </div>
      </Layout>
    );
  }

  const handleInputChange = (field: keyof ShippingAddress, value: string) => {
    setShippingAddress(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const requiredFields: (keyof ShippingAddress)[] = [
      'full_name', 'address_line1', 'city', 'state', 'postal_code', 'country'
    ];

    for (const field of requiredFields) {
      if (!shippingAddress[field]) {
        toast({
          title: 'Missing information',
          description: 'Please fill in all required shipping fields.',
          variant: 'destructive',
        });
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // Simulate order placement
      await new Promise(resolve => setTimeout(resolve, 1500));

      const orderNumber = `GT-${Date.now().toString(36).toUpperCase()}`;
      clearCart();

      toast({
        title: 'Order placed successfully!',
        description: `Your order #${orderNumber} has been confirmed.`,
      });

      navigate('/account');
    } catch {
      toast({
        title: 'Order failed',
        description: 'There was an error placing your order. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Shipping & Notes */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" /> Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <Label htmlFor="full_name">Full Name *</Label>
                      <Input id="full_name" value={shippingAddress.full_name} onChange={(e) => handleInputChange('full_name', e.target.value)} required />
                    </div>
                    <div className="sm:col-span-2">
                      <Label htmlFor="address_line1">Address Line 1 *</Label>
                      <Input id="address_line1" value={shippingAddress.address_line1} onChange={(e) => handleInputChange('address_line1', e.target.value)} placeholder="Street address" required />
                    </div>
                    <div className="sm:col-span-2">
                      <Label htmlFor="address_line2">Address Line 2</Label>
                      <Input id="address_line2" value={shippingAddress.address_line2} onChange={(e) => handleInputChange('address_line2', e.target.value)} placeholder="Apartment, suite, etc. (optional)" />
                    </div>
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input id="city" value={shippingAddress.city} onChange={(e) => handleInputChange('city', e.target.value)} required />
                    </div>
                    <div>
                      <Label htmlFor="state">State / Province *</Label>
                      <Input id="state" value={shippingAddress.state} onChange={(e) => handleInputChange('state', e.target.value)} required />
                    </div>
                    <div>
                      <Label htmlFor="postal_code">Postal Code *</Label>
                      <Input id="postal_code" value={shippingAddress.postal_code} onChange={(e) => handleInputChange('postal_code', e.target.value)} required />
                    </div>
                    <div>
                      <Label htmlFor="country">Country *</Label>
                      <Input id="country" value={shippingAddress.country} onChange={(e) => handleInputChange('country', e.target.value)} required />
                    </div>
                    <div className="sm:col-span-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" value={shippingAddress.phone} onChange={(e) => handleInputChange('phone', e.target.value)} placeholder="For delivery updates" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Order Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea value={customerNotes} onChange={(e) => setCustomerNotes(e.target.value)} placeholder="Any special instructions..." rows={3} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" /> Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    Payments are simulated. Connect your provider to accept real payments.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-3">
                      <div className="w-16 h-16 bg-muted rounded overflow-hidden flex-shrink-0">
                        {item.product.image_url && <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{item.product.name}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        <p className="text-sm font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}

                  <Separator />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${getSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>{getShippingTotal() === 0 ? 'Free' : `$${getShippingTotal().toFixed(2)}`}</span>
                    </div>
                    {discountCode && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount ({discountCode})</span>
                        <span>-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${getTotal().toFixed(2)}</span>
                  </div>

                  <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Processing...' : 'Place Order'}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    By placing your order, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
}
