import { supabase } from './supabase'

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
   TYPES (FRONTEND)
======================= */

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
  category?: Category
  images: ProductImage[]
}

export interface CartItem {
  id: string
  product_id: string
  quantity: number
  product: Product
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
}

export interface OrderItem {
  id: string
  product_name: string
  quantity: number
  unit_price: number
  total_price: number
}

export interface Review {
  id: string
  product_id: string
  rating: number
  title?: string
  content: string
  created_at: string
}
