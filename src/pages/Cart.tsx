import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';

const Cart = () => {
  const navigate = useNavigate();
  const [discountInput, setDiscountInput] = useState('');
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);
  
  const {
    items,
    discountCode,
    discountAmount,
    updateQuantity,
    removeItem,
    applyDiscount,
    removeDiscount,
    getSubtotal,
    getShippingTotal,
    getTotal,
  } = useCartStore();
  
  const { isAuthenticated } = useAuthStore();

  const handleApplyDiscount = async () => {
    if (!discountInput.trim()) return;
    
    setIsApplyingDiscount(true);
    
    // Simulate API call to validate discount code
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // Mock discount codes
    const mockCodes: Record<string, { percent: number; message: string }> = {
      'WELCOME10': { percent: 10, message: '10% off your first order!' },
      'SAVE20': { percent: 20, message: '20% discount applied!' },
    };
    
    const code = mockCodes[discountInput.toUpperCase()];
    if (code) {
      const discountValue = (getSubtotal() * code.percent) / 100;
      applyDiscount(discountInput.toUpperCase(), discountValue);
      toast.success(code.message);
    } else {
      toast.error('Invalid discount code');
    }
    
    setIsApplyingDiscount(false);
    setDiscountInput('');
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.info('Please sign in to checkout');
      navigate('/login?redirect=/checkout');
      return;
    }
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
          <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-8">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Button asChild size="lg">
            <Link to="/products">
              Start Shopping
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.product.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className="flex gap-4 p-4 border rounded-lg"
                  >
                    {/* Image */}
                    <Link
                      to={`/products/${item.product.slug}`}
                      className="flex-shrink-0"
                    >
                      <img
                        src={item.product.images?.[0]?.image_url}
                        alt={item.product.name}
                        className="w-24 h-24 object-cover rounded-md"
                      />
                    </Link>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/products/${item.product.slug}`}
                        className="font-medium hover:text-primary transition-colors line-clamp-2"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-muted-foreground mt-1">
                        ${item.product.price.toFixed(2)} each
                      </p>
                      {item.product.is_free_shipping ? (
                        <p className="text-sm text-green-600 mt-1">Free Shipping</p>
                      ) : (
                        <p className="text-sm text-muted-foreground mt-1">
                          +${(item.product.shipping_cost ?? 0).toFixed(2)} shipping
                        </p>
                      )}

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center border rounded-md">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() => removeItem(item.product.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <span className="font-semibold">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="border rounded-lg p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

              {/* Discount Code */}
              <div className="mb-6">
                {discountCode ? (
                  <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-md">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">{discountCode}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={removeDiscount}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Discount code"
                      value={discountInput}
                      onChange={(e) => setDiscountInput(e.target.value)}
                    />
                    <Button
                      variant="outline"
                      onClick={handleApplyDiscount}
                      disabled={isApplyingDiscount || !discountInput.trim()}
                    >
                      Apply
                    </Button>
                  </div>
                )}
              </div>

              <Separator className="mb-4" />

              {/* Totals */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${getSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>
                    {getShippingTotal() === 0 ? 'Free' : `$${getShippingTotal().toFixed(2)}`}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${getTotal().toFixed(2)}</span>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full mt-6"
                onClick={handleCheckout}
              >
                Proceed to Checkout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <p className="text-xs text-center text-muted-foreground mt-4">
                Taxes calculated at checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
