import { supabase } from './supabase';

// Re-export supabase client
export { supabase };

/* =======================
   TYPES
======================= */

export type ProductImage = {
  id: string;
  product_id: string;
  image_url: string;
  alt_text: string | null;
  is_primary: boolean;
  display_order: number;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  image_url: string | null;
  category_id: string | null;
  category?: Category;
  is_featured: boolean;
  is_active: boolean;
  is_in_stock: boolean;
  is_free_shipping: boolean;
  shipping_cost: number | null;
  average_rating: number | null;
  review_count: number;
  images?: ProductImage[];
  created_at: string;
};

export type Review = {
  id: string;
  product_id: string;
  user_id: string;
  user_name: string | null;
  rating: number;
  title: string | null;
  content: string | null;
  comment: string | null;
  is_verified_purchase: boolean;
  is_approved: boolean;
  created_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
};

export type Order = {
  id: string;
  user_id: string;
  order_number: string;
  status: string;
  subtotal: number;
  shipping_cost: number;
  discount_amount: number;
  grand_total: number;
  total: number;
  tracking_number: string | null;
  items?: OrderItem[];
  created_at: string;
};

export type Address = {
  id: string;
  user_id: string;
  full_name: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string | null;
  is_default: boolean;
};

export type Message = {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
};

export type Conversation = {
  id: string;
  user_id: string;
  subject: string;
  status: string;
  created_at: string;
  updated_at: string;
  messages?: Message[];
  user_email?: string;
  last_message?: string;
  unread_count?: number;
};

export type User = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
  created_at: string;
};

/* =======================
   PRODUCTS
======================= */

export const productsApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        images:product_images(*)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as Product[];
  },

  async list() {
    return this.getAll();
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        images:product_images(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Product;
  },

  async getBySlug(slug: string) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        images:product_images(*)
      `)
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return data as Product;
  },

  async getFeatured() {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        images:product_images(*)
      `)
      .eq('is_featured', true)
      .eq('is_active', true)
      .limit(8);

    if (error) throw error;
    return (data || []) as Product[];
  },

  async create(payload: Partial<Product>) {
    const { data, error } = await supabase
      .from('products')
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return data as Product;
  },

  async update(id: string, payload: Partial<Product>) {
    const { data, error } = await supabase
      .from('products')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Product;
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
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    if (error) throw error;
    return (data || []) as Category[];
  },

  async list() {
    return this.getAll();
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as Category;
  },

  async create(payload: Partial<Category>) {
    const { data, error } = await supabase
      .from('categories')
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return data as Category;
  },

  async update(id: string, payload: Partial<Category>) {
    const { data, error } = await supabase
      .from('categories')
      .update(payload)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Category;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
};

/* =======================
   REVIEWS
======================= */

export const reviewsApi = {
  async getForProduct(productId: string) {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .eq('is_approved', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as Review[];
  },

  async listForProduct(productId: string) {
    return this.getForProduct(productId);
  },

  async getAll() {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as Review[];
  },

  async create(payload: Partial<Review>) {
    const { data, error } = await supabase
      .from('reviews')
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return data as Review;
  },

  async update(id: string, payload: Partial<Review>) {
    const { data, error } = await supabase
      .from('reviews')
      .update(payload)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Review;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
};

/* =======================
   ORDERS
======================= */

export const ordersApi = {
  async getMine(userId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as Order[];
  },

  async list(userId: string) {
    return this.getMine(userId);
  },

  async getAll() {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as Order[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Order;
  },

  async create(payload: Partial<Order>) {
    const { data, error } = await supabase
      .from('orders')
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return data as Order;
  },

  async update(id: string, payload: Partial<Order>) {
    const { data, error } = await supabase
      .from('orders')
      .update(payload)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Order;
  },
};

/* =======================
   MESSAGES
======================= */

export const messagesApi = {
  async getConversations() {
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        messages(*)
      `)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return (data || []) as Conversation[];
  },

  async getConversation(id: string) {
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        messages(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Conversation;
  },

  async createConversation(payload: { user_id: string; subject: string }) {
    const { data, error } = await supabase
      .from('conversations')
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return data as Conversation;
  },

  async sendMessage(payload: { conversation_id: string; sender_id: string; content: string }) {
    const { data, error } = await supabase
      .from('messages')
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return data as Message;
  },

  async markAsRead(conversationId: string) {
    const { error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('conversation_id', conversationId);
    if (error) throw error;
  },

  async updateConversationStatus(id: string, status: string) {
    const { data, error } = await supabase
      .from('conversations')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Conversation;
  },
};
