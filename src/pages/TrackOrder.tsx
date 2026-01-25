import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Package, Search } from 'lucide-react';
import { toast } from 'sonner';

const TrackOrder = () => {
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!orderId.trim() || !email.trim()) {
      toast.error('Please enter both order ID and email');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // TODO: Replace with actual API call to backend
    toast.info('Order tracking requires backend integration. Check your email for tracking info or log in to view order history.');
    
    setIsLoading(false);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <Package className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Track Your Order</h1>
            <p className="text-muted-foreground">
              Enter your order details to check the status of your shipment.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="orderId">Order ID</Label>
              <Input
                id="orderId"
                placeholder="e.g., ORD-123456"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                You can find your order ID in the confirmation email.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full gap-2" disabled={isLoading}>
              <Search className="h-4 w-4" />
              {isLoading ? 'Searching...' : 'Track Order'}
            </Button>
          </form>

          <div className="mt-8 p-4 bg-secondary/50 rounded-lg text-sm">
            <p className="font-medium mb-2">Already have an account?</p>
            <p className="text-muted-foreground">
              <a href="/login" className="text-primary hover:underline">
                Log in
              </a>{' '}
              to view your complete order history and tracking information.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TrackOrder;
