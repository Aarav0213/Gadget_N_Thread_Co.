import { supabase } from './supabase';

/* =======================
   TYPES
======================= */

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  category_id: string | null;
  is_featured: boolean;
  is_free_shipping: boolean;
  shipping_cost: number | null;
  created_at: string;
};

export type Category = {
  id: string;
  name: string;
  created_at: string;
};

export type Review = {
  id: string;
  product_id: string;
  rating: number;
  comment: string;
  created_at: string;
};

export type Order = {
  id: string;
  user_id: string;
  total: number;
  status: string;
  created_at: string;
};

/* =======================
   PRODUCTS
======================= */

export const productsApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Product[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Product;
  },

  async create(payload: Partial<Product>) {
    const { error } = await supabase.from('products').insert(payload);
    if (error) throw error;
  },

  async update(id: string, payload: Partial<Product>) {
    const { error } = await supabase
      .from('products')
      .update(payload)
      .eq('id', id);

    if (error) throw error;
  },

  async remove(id: string) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

/* =======================
   CATEGORIES
======================= */

export const categoriesApi = {
  async getAll() {
    const { data, error } = await supabase.from('categories').select('*');
    if (error) throw error;
    return data as Category[];
  },
};

/* =======================
   REVIEWS  (FIXES ProductDetail.tsx ERROR)
======================= */

export const reviewsApi = {
  async getForProduct(productId: string) {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Review[];
  },
};

/* =======================
   ORDERS  (FIXES Account.tsx ERROR)
======================= */

export const ordersApi = {
  async getMine(userId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Order[];
  },
};
