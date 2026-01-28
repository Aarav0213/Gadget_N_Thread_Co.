import { createClient } from '@supabase/supabase-js'

/* =======================
   SUPABASE CLIENT
======================= */

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
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  },

  register: async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error

    if (data.user) {
      await profilesApi.upsert({
        id: data.user.id,
        email,
        full_name: fullName,
        role: 'customer',
      })
    }

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
   PROFILES
======================= */

export const profilesApi = {
  get: async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data
  },

  upsert: async (profile: {
    id: string
    email?: string
    full_name?: string
    phone?: string
    role?: 'admin' | 'customer'
  }) => {
    const { data, error } = await supabase
      .from('profiles')
      .upsert(profile)
      .select()
      .single()

    if (error) throw error
    return data
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
}

/* =======================
   PRODUCTS
======================= */

export const productsApi = {
  list: async () => {
    const { data, error } = await supabase
      .from('products')
      .select(`*, category:categories(*), images:product_images(*)`)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  getBySlug: async (slug: string) => {
    const { data, error } = await supabase
      .from('products')
      .select(`*, category:categories(*), images:product_images(*)`)
      .eq('slug', slug)
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
}

/* =======================
   ORDERS ✅ FIX
======================= */

export const ordersApi = {
  listForUser: async (userId: string) => {
    const { data, error } = await supabase
      .from('orders')
      .select(`*, items:order_items(*)`)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },
}

/* =======================
   TYPES
======================= */

export interface Category {
  id: string
  name: string
  slug: string
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
  shipping_cost: number
  is_free_shipping: boolean
  is_in_stock: boolean
  is_active: boolean
  category?: Category
  images: ProductImage[]
}

export interface Review {
  id: string
  product_id: string
  rating: number
  content: string
  created_at: string
}

export interface Order {
  id: string
  status: string
  grand_total: number
  created_at: string
}
