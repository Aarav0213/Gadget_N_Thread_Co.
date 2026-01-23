// API Configuration for self-hosted backend
// Set VITE_API_URL in your environment to point to your backend

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Helper for making authenticated requests
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('auth_token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || 'Request failed');
  }
  
  return response.json();
}

// Auth helpers
export const authApi = {
  login: (email: string, password: string) =>
    apiRequest<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  
  register: (data: { email: string; password: string; fullName: string }) =>
    apiRequest<{ token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  logout: () => apiRequest('/auth/logout', { method: 'POST' }),
  
  getMe: () => apiRequest<User>('/auth/me'),
  
  forgotPassword: (email: string) =>
    apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
};

// Products API
export const productsApi = {
  list: (params?: ProductListParams) => {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.set('category', params.category);
    if (params?.search) searchParams.set('search', params.search);
    if (params?.minPrice) searchParams.set('minPrice', params.minPrice.toString());
    if (params?.maxPrice) searchParams.set('maxPrice', params.maxPrice.toString());
    if (params?.sort) searchParams.set('sort', params.sort);
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    
    return apiRequest<{ products: Product[]; total: number }>(`/products?${searchParams}`);
  },
  
  get: (slug: string) => apiRequest<Product>(`/products/${slug}`),
  
  getReviews: (productId: string) =>
    apiRequest<Review[]>(`/products/${productId}/reviews`),
};

// Categories API
export const categoriesApi = {
  list: () => apiRequest<Category[]>('/categories'),
  get: (slug: string) => apiRequest<Category & { products: Product[] }>(`/categories/${slug}`),
};

// Cart API (for server-side cart, or use local store)
export const cartApi = {
  get: () => apiRequest<CartItem[]>('/cart'),
  add: (productId: string, quantity: number) =>
    apiRequest<CartItem>('/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    }),
  update: (itemId: string, quantity: number) =>
    apiRequest<CartItem>(`/cart/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    }),
  remove: (itemId: string) =>
    apiRequest(`/cart/${itemId}`, { method: 'DELETE' }),
  clear: () => apiRequest('/cart', { method: 'DELETE' }),
};

// Orders API
export const ordersApi = {
  list: () => apiRequest<Order[]>('/orders'),
  get: (id: string) => apiRequest<Order>(`/orders/${id}`),
  create: (data: CreateOrderData) =>
    apiRequest<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Discount Codes API
export const discountApi = {
  validate: (code: string) =>
    apiRequest<DiscountCode>('/discount-codes/validate', {
      method: 'POST',
      body: JSON.stringify({ code }),
    }),
};

// Messages API
export const messagesApi = {
  getConversations: () => apiRequest<Conversation[]>('/conversations'),
  getMessages: (conversationId: string) =>
    apiRequest<Message[]>(`/conversations/${conversationId}`),
  startConversation: (data: { subject: string; content: string; productId?: string }) =>
    apiRequest<Conversation>('/conversations', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  sendMessage: (conversationId: string, content: string) =>
    apiRequest<Message>(`/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),
};

// Reviews API
export const reviewsApi = {
  create: (productId: string, data: { rating: number; title?: string; content: string }) =>
    apiRequest<Review>(`/products/${productId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Types
export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'customer' | 'admin';
  avatarUrl?: string;
  phone?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  parentId?: string;
  displayOrder: number;
  isActive: boolean;
}

export interface ProductImage {
  id: string;
  imageUrl: string;
  altText?: string;
  displayOrder: number;
  isPrimary: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  categoryId?: string;
  category?: Category;
  shippingCost: number;
  isFreeShipping: boolean;
  isInStock: boolean;
  isActive: boolean;
  isFeatured: boolean;
  images: ProductImage[];
  averageRating?: number;
  reviewCount?: number;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  subtotal: number;
  shippingTotal: number;
  discountTotal: number;
  grandTotal: number;
  items: OrderItem[];
  shippingAddress: Address;
  trackingNumber?: string;
  trackingUrl?: string;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  productName: string;
  productImageUrl?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Address {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface DiscountCode {
  id: string;
  code: string;
  description?: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minimumOrderAmount: number;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title?: string;
  content: string;
  isVerifiedPurchase: boolean;
  isFeatured: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  userId: string;
  productId?: string;
  subject: string;
  status: 'open' | 'resolved' | 'closed';
  lastMessageAt: string;
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderType: 'customer' | 'admin';
  content: string;
  isRead: boolean;
  createdAt: string;
}

export interface ProductListParams {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'popular' | 'rating';
  page?: number;
  limit?: number;
}

export interface CreateOrderData {
  items: { productId: string; quantity: number }[];
  shippingAddress: Address;
  discountCode?: string;
  customerNotes?: string;
}
