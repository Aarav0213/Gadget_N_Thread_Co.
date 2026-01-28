import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

/* =======================
   AUTH
======================= */

export const authApi = {
  login: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data
  },

  register: async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    })
    if (error) throw error
    return data
  },

  logout: async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  getMe: async () => {
    const { data, error } = await supabase.auth.getUser()
    if (error) throw error
    return data.user
  },
}

/* =======================
   CATEGORIES
======================= */

export const categoriesApi = {
  list: async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order')

    if (error) throw error
    return data
  },

  getBySlug: async (slug: string) => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) throw error
    return data
  },

  create: async (category: Partial<Category>) => {
    const { data, error } = await supabase
      .from('categories')
      .insert(category)
      .select()
      .single()

    if (error) throw error
    return data
  },

  update: async (id: string, category: Partial<Category>) => {
    const { data, error } = await supabase
      .from('categories')
      .update(category)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  delete: async (id: string) => {
    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (error) throw error
  },
}

/* =======================
   PRODUCTS
======================= */

export const productsApi = {
  list: async () => {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        images:product_images(
          id,
          image_url,
          alt_text,
          display_order,
          is_primary
        )
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  getBySlug: async (slug: string) => {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        images:product_images(
          id,
          image_url,
          alt_text,
          display_order,
          is_primary
        )
      `)
      .eq('slug', slug)
      .single()

    if (error) throw error
    return data
  },

  create: async (product: Partial<Product>) => {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single()

    if (error) throw error
    return data
  },

  update: async (id: string, product: Partial<Product>) => {
    const { data, error } = await supabase
      .from('products')
      .update(product)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  delete: async (id: string) => {
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) throw error
  },
}

/* =======================
   CART
======================= */

export const cartApi = {
  get: async () => {
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        product:products(
          *,
          images:product_images(*)
        )
      `)

    if (error) throw error
    return data
  },

  add: async (productId: string, quantity: number) => {
    const { data, error } = await supabase
      .from('cart_items')
      .insert({ product_id: productId, quantity })
      .select()
      .single()

    if (error) throw error
    return data
  },

  update: async (itemId: string, quantity: number) => {
    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', itemId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  remove: async (itemId: string) => {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId)

    if (error) throw error
  },

  clear: async () => {
    const { error } = await supabase.from('cart_items').delete().neq('id', '')
    if (error) throw error
  },
}

/* =======================
   ORDERS
======================= */

export const ordersApi = {
  list: async () => {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(*)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  get: async (id: string) => {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(*)
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  updateStatus: async (id: string, status: string) => {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  addTracking: async (id: string, trackingNumber: string, trackingUrl?: string) => {
    const { data, error } = await supabase
      .from('orders')
      .update({ tracking_number: trackingNumber, tracking_url: trackingUrl })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },
}

/* =======================
   REVIEWS
======================= */

export const reviewsApi = {
  listForProduct: async (productId: string) => {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  create: async (
    productId: string,
    rating: number,
    content: string,
    title?: string
  ) => {
    const { data, error } = await supabase
      .from('reviews')
      .insert({
        product_id: productId,
        rating,
        content,
        title,
      })
      .select()
      .single()

    if (error) throw error
    return data
  },
}

/* =======================
   MESSAGES & CONVERSATIONS
======================= */

export const messagesApi = {
  listConversations: async () => {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .order('last_message_at', { ascending: false })

    if (error) throw error
    return data
  },

  getMessages: async (conversationId: string) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })

    if (error) throw error
    return data
  },

  sendMessage: async (conversationId: string, content: string, senderType: 'admin' | 'customer') => {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        content,
        sender_type: senderType,
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  updateConversationStatus: async (id: string, status: 'open' | 'resolved') => {
    const { data, error } = await supabase
      .from('conversations')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },
}

/* =======================
   TYPES (FRONTEND)
======================= */

export interface User {
  id: string
  email: string
  fullName: string
  role: 'admin' | 'customer'
}

export interface Address {
  fullName: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone?: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image_url?: string
  display_order: number
  is_active: boolean
}

export interface ProductImage {
  id: string
  image_url: string
  alt_text?: string
  display_order: number
  is_primary: boolean
}

export interface Product {
  id: string
  name: string
  slug: string
  description?: string
  price: number
  compare_at_price?: number
  shipping_cost: number
  is_free_shipping: boolean
  is_in_stock: boolean
  is_active: boolean
  is_featured: boolean
  average_rating?: number
  review_count?: number
  category_id?: string
  category?: Category
  images: ProductImage[]
  created_at?: string
}

export interface CartItem {
  id: string
  product_id: string
  quantity: number
  product: Product
}

export interface OrderItem {
  id: string
  product_name: string
  product_image_url?: string
  quantity: number
  unit_price: number
  total_price: number
}

export interface Order {
  id: string
  order_number: string
  status: string
  subtotal: number
  shipping_total: number
  discount_total: number
  grand_total: number
  created_at: string
  items: OrderItem[]
  shipping_address?: Address
  tracking_number?: string
  tracking_url?: string
}

export interface Review {
  id: string
  product_id: string
  user_id?: string
  user_name?: string
  rating: number
  title?: string
  content: string
  is_verified_purchase?: boolean
  created_at: string
}

export interface Conversation {
  id: string
  user_id: string
  product_id?: string
  subject: string
  status: 'open' | 'resolved'
  last_message_at: string
  created_at: string
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  sender_type: 'admin' | 'customer'
  content: string
  is_read: boolean
  created_at: string
}
