import { supabase } from './supabase';

/* =====================
   TYPES
===================== */

export type Product = {
  id: string;
  name: string;
  price: number;
  description: string | null;
  category_id: string | null;
  is_featured: boolean;
  created_at: string;
};

export type Category = {
  id: string;
  name: string;
};

export type Order = {
  id: string;
  user_id: string;
  total: number;
  status: string;
  created_at: string;
};

/* =====================
   PRODUCTS
===================== */

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
};

/* =====================
   CATEGORIES
===================== */

export const categoriesApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('categories')
      .select('*');

    if (error) throw error;
    return data as Category[];
  },
};

/* =====================
   ORDERS  ✅ THIS WAS MISSING
===================== */

export const ordersApi = {
  async getByUser(userId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Order[];
  },
};
