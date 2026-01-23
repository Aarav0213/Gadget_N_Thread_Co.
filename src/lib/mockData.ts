// Mock data for development - Replace with API calls when backend is ready
import type { Product, Category, Review } from '@/lib/api';

export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Electronics',
    slug: 'electronics',
    description: 'Latest gadgets and tech accessories',
    imageUrl: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400',
    displayOrder: 1,
    isActive: true,
  },
  {
    id: '2',
    name: 'Apparel',
    slug: 'apparel',
    description: 'Stylish clothing and accessories',
    imageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400',
    displayOrder: 2,
    isActive: true,
  },
  {
    id: '3',
    name: 'Home & Living',
    slug: 'home-living',
    description: 'Modern home essentials',
    imageUrl: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400',
    displayOrder: 3,
    isActive: true,
  },
  {
    id: '4',
    name: 'Accessories',
    slug: 'accessories',
    description: 'Complete your look',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    displayOrder: 4,
    isActive: true,
  },
];

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Noise-Canceling Headphones',
    slug: 'wireless-noise-canceling-headphones',
    description: 'Experience premium sound quality with our latest wireless headphones. Features active noise cancellation, 30-hour battery life, and ultra-comfortable ear cushions for all-day wear.',
    price: 199.99,
    compareAtPrice: 249.99,
    categoryId: '1',
    category: mockCategories[0],
    shippingCost: 0,
    isFreeShipping: true,
    isInStock: true,
    isActive: true,
    isFeatured: true,
    images: [
      { id: '1', imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600', altText: 'Headphones front view', displayOrder: 0, isPrimary: true },
      { id: '2', imageUrl: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600', altText: 'Headphones side view', displayOrder: 1, isPrimary: false },
      { id: '3', imageUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600', altText: 'Headphones lifestyle', displayOrder: 2, isPrimary: false },
    ],
    averageRating: 4.8,
    reviewCount: 124,
  },
  {
    id: '2',
    name: 'Minimalist Leather Watch',
    slug: 'minimalist-leather-watch',
    description: 'A timeless piece that combines elegance with simplicity. Genuine Italian leather strap, sapphire crystal glass, and Japanese quartz movement.',
    price: 149.99,
    categoryId: '4',
    category: mockCategories[3],
    shippingCost: 5.99,
    isFreeShipping: false,
    isInStock: true,
    isActive: true,
    isFeatured: true,
    images: [
      { id: '4', imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600', altText: 'Watch front view', displayOrder: 0, isPrimary: true },
      { id: '5', imageUrl: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600', altText: 'Watch on wrist', displayOrder: 1, isPrimary: false },
    ],
    averageRating: 4.9,
    reviewCount: 89,
  },
  {
    id: '3',
    name: 'Premium Cotton T-Shirt',
    slug: 'premium-cotton-tshirt',
    description: 'Made from 100% organic cotton, this premium t-shirt offers unmatched comfort and durability. Pre-shrunk fabric ensures a perfect fit wash after wash.',
    price: 39.99,
    compareAtPrice: 49.99,
    categoryId: '2',
    category: mockCategories[1],
    shippingCost: 4.99,
    isFreeShipping: false,
    isInStock: true,
    isActive: true,
    isFeatured: false,
    images: [
      { id: '6', imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600', altText: 'T-shirt front', displayOrder: 0, isPrimary: true },
      { id: '7', imageUrl: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600', altText: 'T-shirt styled', displayOrder: 1, isPrimary: false },
    ],
    averageRating: 4.5,
    reviewCount: 256,
  },
  {
    id: '4',
    name: 'Smart Home Speaker',
    slug: 'smart-home-speaker',
    description: 'Voice-controlled smart speaker with premium audio quality. Control your smart home, play music, get answers, and more with just your voice.',
    price: 129.99,
    categoryId: '1',
    category: mockCategories[0],
    shippingCost: 0,
    isFreeShipping: true,
    isInStock: true,
    isActive: true,
    isFeatured: true,
    images: [
      { id: '8', imageUrl: 'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=600', altText: 'Smart speaker', displayOrder: 0, isPrimary: true },
    ],
    averageRating: 4.6,
    reviewCount: 312,
  },
  {
    id: '5',
    name: 'Ceramic Desk Lamp',
    slug: 'ceramic-desk-lamp',
    description: 'Handcrafted ceramic lamp with adjustable brightness. The perfect blend of functionality and artistry for your workspace or bedside.',
    price: 89.99,
    categoryId: '3',
    category: mockCategories[2],
    shippingCost: 8.99,
    isFreeShipping: false,
    isInStock: true,
    isActive: true,
    isFeatured: false,
    images: [
      { id: '9', imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600', altText: 'Desk lamp', displayOrder: 0, isPrimary: true },
      { id: '10', imageUrl: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600', altText: 'Lamp in room', displayOrder: 1, isPrimary: false },
    ],
    averageRating: 4.7,
    reviewCount: 67,
  },
  {
    id: '6',
    name: 'Portable Power Bank',
    slug: 'portable-power-bank',
    description: '20000mAh high-capacity power bank with fast charging. Charge multiple devices simultaneously with USB-C and USB-A ports.',
    price: 49.99,
    compareAtPrice: 69.99,
    categoryId: '1',
    category: mockCategories[0],
    shippingCost: 3.99,
    isFreeShipping: false,
    isInStock: true,
    isActive: true,
    isFeatured: false,
    images: [
      { id: '11', imageUrl: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600', altText: 'Power bank', displayOrder: 0, isPrimary: true },
    ],
    averageRating: 4.4,
    reviewCount: 198,
  },
  {
    id: '7',
    name: 'Linen Throw Blanket',
    slug: 'linen-throw-blanket',
    description: 'Luxuriously soft linen blanket, perfect for cozy evenings. Naturally breathable and gets softer with every wash.',
    price: 79.99,
    categoryId: '3',
    category: mockCategories[2],
    shippingCost: 6.99,
    isFreeShipping: false,
    isInStock: true,
    isActive: true,
    isFeatured: true,
    images: [
      { id: '12', imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600', altText: 'Throw blanket', displayOrder: 0, isPrimary: true },
    ],
    averageRating: 4.8,
    reviewCount: 145,
  },
  {
    id: '8',
    name: 'Canvas Messenger Bag',
    slug: 'canvas-messenger-bag',
    description: 'Durable canvas messenger bag with leather accents. Multiple compartments keep you organized on the go.',
    price: 69.99,
    categoryId: '4',
    category: mockCategories[3],
    shippingCost: 5.99,
    isFreeShipping: false,
    isInStock: true,
    isActive: true,
    isFeatured: false,
    images: [
      { id: '13', imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600', altText: 'Messenger bag', displayOrder: 0, isPrimary: true },
    ],
    averageRating: 4.6,
    reviewCount: 78,
  },
];

export const mockReviews: Record<string, Review[]> = {
  '1': [
    {
      id: 'r1',
      productId: '1',
      userId: 'u1',
      userName: 'Sarah M.',
      rating: 5,
      title: 'Best headphones I\'ve ever owned!',
      content: 'The noise cancellation is incredible. I use these for work calls and music, and they exceed my expectations in both areas. Battery life is amazing too!',
      isVerifiedPurchase: true,
      isFeatured: true,
      createdAt: '2024-01-15T10:30:00Z',
    },
    {
      id: 'r2',
      productId: '1',
      userId: 'u2',
      userName: 'James K.',
      rating: 5,
      title: 'Premium quality',
      content: 'Worth every penny. The build quality is top-notch and they\'re so comfortable I forget I\'m wearing them.',
      isVerifiedPurchase: true,
      isFeatured: false,
      createdAt: '2024-01-10T14:20:00Z',
    },
    {
      id: 'r3',
      productId: '1',
      userId: 'u3',
      userName: 'Emily R.',
      rating: 4,
      title: 'Great but slightly heavy',
      content: 'Sound quality is fantastic and the ANC works really well. Only minor complaint is they feel a bit heavy after several hours.',
      isVerifiedPurchase: true,
      isFeatured: false,
      createdAt: '2024-01-05T09:15:00Z',
    },
  ],
  '2': [
    {
      id: 'r4',
      productId: '2',
      userId: 'u4',
      userName: 'Michael T.',
      rating: 5,
      title: 'Elegant and timeless',
      content: 'This watch is absolutely beautiful. The leather strap is genuine quality and the minimalist design goes with everything.',
      isVerifiedPurchase: true,
      isFeatured: true,
      createdAt: '2024-01-12T16:45:00Z',
    },
  ],
};

// Helper function to filter and search products
export function filterProducts(
  products: Product[],
  filters: {
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
  }
): Product[] {
  return products.filter((product) => {
    if (filters.category && product.category?.slug !== filters.category) {
      return false;
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesName = product.name.toLowerCase().includes(searchLower);
      const matchesDescription = product.description?.toLowerCase().includes(searchLower);
      if (!matchesName && !matchesDescription) {
        return false;
      }
    }
    
    if (filters.minPrice !== undefined && product.price < filters.minPrice) {
      return false;
    }
    
    if (filters.maxPrice !== undefined && product.price > filters.maxPrice) {
      return false;
    }
    
    if (filters.inStock && !product.isInStock) {
      return false;
    }
    
    return true;
  });
}

export function sortProducts(
  products: Product[],
  sort: 'price_asc' | 'price_desc' | 'newest' | 'popular' | 'rating' = 'newest'
): Product[] {
  const sorted = [...products];
  
  switch (sort) {
    case 'price_asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price_desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'rating':
      return sorted.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
    case 'popular':
      return sorted.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
    case 'newest':
    default:
      return sorted;
  }
}
