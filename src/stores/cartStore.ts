import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/lib/api';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  discountCode: string | null;
  discountAmount: number;

  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyDiscount: (code: string, amount: number) => void;
  removeDiscount: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
  getShippingTotal: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      discountCode: null,
      discountAmount: 0,

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product.id === product.id
          );
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }
          return { items: [...state.items, { product, quantity }] };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [], discountCode: null, discountAmount: 0 });
      },

      applyDiscount: (code, amount) => {
        set({ discountCode: code, discountAmount: amount });
      },

      removeDiscount: () => {
        set({ discountCode: null, discountAmount: 0 });
      },

      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },

      getShippingTotal: () => {
        return get().items.reduce((total, item) => {
          if (item.product.is_free_shipping) return total;
          return total + (item.product.shipping_cost ?? 0);
        }, 0);
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const shipping = get().getShippingTotal();
        const discount = get().discountAmount;
        return Math.max(0, subtotal + shipping - discount);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
