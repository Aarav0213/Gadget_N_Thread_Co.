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
   PROFILES (CRITICAL)
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
   REVIEWS ✅ (FIX)
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

  create: async (productId: string, rating: number, content: string, title?: string) => {
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
   TYPES
======================= */

export interface Category {
  id: string
  name: string
  slug: string
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
  shipping_cost: number
  is_free_shipping: boolean
  is_in_stock: boolean
  is_active: boolean
  is_featured: boolean
  category?: Category
  images: ProductImage[]
}

export interface Review {
  id: string
  product_id: string
  rating: number
  title?: string
  content: string
  created_at: string
}
