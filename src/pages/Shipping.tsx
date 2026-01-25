import { Layout } from '@/components/layout/Layout';
import { Package, Truck, Globe, Clock } from 'lucide-react';

const Shipping = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Shipping Information</h1>
          <p className="text-muted-foreground mb-8">
            Everything you need to know about our shipping policies and delivery times.
          </p>

          {/* Shipping Options */}
          <div className="grid gap-6 mb-12">
            <div className="flex gap-4 p-6 border rounded-lg">
              <Package className="h-8 w-8 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Standard Shipping</h3>
                <p className="text-muted-foreground text-sm mb-2">
                  5-10 business days delivery
                </p>
                <p className="text-sm">
                  Free on orders over $50. Otherwise, shipping costs are calculated at checkout based on the items in your cart.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 border rounded-lg">
              <Truck className="h-8 w-8 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Express Shipping</h3>
                <p className="text-muted-foreground text-sm mb-2">
                  2-3 business days delivery
                </p>
                <p className="text-sm">
                  Available for an additional $15. Express orders placed before 2pm EST ship same day.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 border rounded-lg">
              <Globe className="h-8 w-8 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">International Shipping</h3>
                <p className="text-muted-foreground text-sm mb-2">
                  10-21 business days delivery
                </p>
                <p className="text-sm">
                  We ship to most countries worldwide. Rates calculated at checkout. Import duties and taxes are the buyer's responsibility.
                </p>
              </div>
            </div>
          </div>

          {/* Processing Time */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Processing Time</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              All orders are processed within 1-2 business days. Orders placed on weekends or holidays will be processed on the next business day.
            </p>
            <p className="text-muted-foreground">
              You will receive a confirmation email once your order has been placed, and a shipping notification with tracking information when your order ships.
            </p>
          </div>

          {/* Important Notes */}
          <div className="bg-secondary/50 rounded-lg p-6">
            <h2 className="font-semibold mb-4">Important Notes</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Delivery times are estimates and not guaranteed.</li>
              <li>• We are not responsible for delays caused by customs or postal services.</li>
              <li>• Please ensure your shipping address is correct before placing your order.</li>
              <li>• P.O. Box addresses may have limited shipping options.</li>
              <li>• All sales are final. Please review your order carefully before checkout.</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Shipping;
