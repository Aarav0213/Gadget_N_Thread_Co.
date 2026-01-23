# Gadget & Thread Co. - Backend Schema Documentation

This document contains all the database tables, API endpoints, and authentication requirements needed to self-host the backend for your dropshipping store.

---

## Database Schema

### 1. Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  role ENUM('customer', 'admin') DEFAULT 'customer',
  avatar_url TEXT,
  phone VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 2. Addresses Table
```sql
CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  address_line1 VARCHAR(255) NOT NULL,
  address_line2 VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  country VARCHAR(100) NOT NULL,
  phone VARCHAR(50),
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 3. Categories Table
```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 4. Products Table
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  compare_at_price DECIMAL(10, 2), -- Original price for showing discounts
  cost_price DECIMAL(10, 2), -- Your cost (for profit tracking)
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  shipping_cost DECIMAL(10, 2) DEFAULT 0,
  is_free_shipping BOOLEAN DEFAULT false,
  stock_quantity INT DEFAULT 0,
  is_in_stock BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  sku VARCHAR(100),
  weight DECIMAL(10, 2),
  meta_title VARCHAR(255),
  meta_description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 5. Product Images Table
```sql
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text VARCHAR(255),
  display_order INT DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 6. Orders Table
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(50) UNIQUE NOT NULL, -- e.g., "GT-1001"
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded') DEFAULT 'pending',
  subtotal DECIMAL(10, 2) NOT NULL,
  shipping_total DECIMAL(10, 2) NOT NULL,
  discount_total DECIMAL(10, 2) DEFAULT 0,
  tax_total DECIMAL(10, 2) DEFAULT 0,
  grand_total DECIMAL(10, 2) NOT NULL,
  discount_code_id UUID REFERENCES discount_codes(id) ON DELETE SET NULL,
  
  -- Shipping Address (stored directly for order history)
  shipping_full_name VARCHAR(255),
  shipping_address_line1 VARCHAR(255),
  shipping_address_line2 VARCHAR(255),
  shipping_city VARCHAR(100),
  shipping_state VARCHAR(100),
  shipping_postal_code VARCHAR(20),
  shipping_country VARCHAR(100),
  shipping_phone VARCHAR(50),
  
  -- Payment Info
  payment_method VARCHAR(50), -- 'stripe', 'paypal'
  payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
  payment_intent_id VARCHAR(255), -- Stripe payment intent or PayPal order ID
  
  -- Tracking
  tracking_number VARCHAR(255),
  tracking_url TEXT,
  shipped_at TIMESTAMP,
  delivered_at TIMESTAMP,
  
  notes TEXT, -- Admin notes
  customer_notes TEXT, -- Customer's order notes
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 7. Order Items Table
```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name VARCHAR(255) NOT NULL, -- Stored for history
  product_image_url TEXT,
  quantity INT NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  shipping_cost DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 8. Discount Codes Table
```sql
CREATE TABLE discount_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT, -- Message to show customers
  discount_type ENUM('percentage', 'fixed') DEFAULT 'percentage',
  discount_value DECIMAL(10, 2) NOT NULL, -- Percentage (e.g., 10 for 10%) or fixed amount
  minimum_order_amount DECIMAL(10, 2) DEFAULT 0,
  max_uses INT, -- NULL for unlimited
  current_uses INT DEFAULT 0,
  starts_at TIMESTAMP,
  expires_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 9. Reviews Table
```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  user_name VARCHAR(255) NOT NULL, -- Stored for display
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  content TEXT,
  is_verified_purchase BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false, -- Requires admin approval
  is_censored BOOLEAN DEFAULT false,
  admin_response TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 10. Messages Table
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL,
  sender_id UUID REFERENCES users(id) ON DELETE SET NULL,
  sender_type ENUM('customer', 'admin') NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 11. Conversations Table
```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL, -- Optional: if about specific product
  subject VARCHAR(255),
  status ENUM('open', 'resolved', 'closed') DEFAULT 'open',
  last_message_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 12. Cart Table (Optional - can use localStorage)
```sql
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);
```

### 13. Wishlist Table
```sql
CREATE TABLE wishlist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);
```

### 14. Settings Table
```sql
CREATE TABLE settings (
  key VARCHAR(100) PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Example settings:
-- 'store_info': { "name": "Gadget & Thread Co.", "email": "...", "phone": "...", "address": "..." }
-- 'payment_config': { "stripe_enabled": true, "paypal_enabled": true }
-- 'shipping_config': { "default_shipping_cost": 5.99 }
```

### 15. Notifications Table
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type ENUM('order', 'message', 'review', 'system') NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  is_read BOOLEAN DEFAULT false,
  link TEXT, -- URL to navigate to
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## API Endpoints

### Authentication
```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - Login user
POST   /api/auth/logout            - Logout user
POST   /api/auth/forgot-password   - Request password reset
POST   /api/auth/reset-password    - Reset password with token
GET    /api/auth/me                - Get current user
PUT    /api/auth/me                - Update current user
```

### Products (Public)
```
GET    /api/products               - List products (with filters, pagination, search)
GET    /api/products/:slug         - Get single product
GET    /api/products/:id/reviews   - Get product reviews
```

### Products (Admin)
```
POST   /api/admin/products         - Create product
PUT    /api/admin/products/:id     - Update product
DELETE /api/admin/products/:id     - Delete product
POST   /api/admin/products/:id/images - Upload product images
DELETE /api/admin/products/:id/images/:imageId - Delete image
```

### Categories (Public)
```
GET    /api/categories             - List all categories
GET    /api/categories/:slug       - Get category with products
```

### Categories (Admin)
```
POST   /api/admin/categories       - Create category
PUT    /api/admin/categories/:id   - Update category
DELETE /api/admin/categories/:id   - Delete category
PUT    /api/admin/categories/reorder - Reorder categories
```

### Cart
```
GET    /api/cart                   - Get user's cart
POST   /api/cart                   - Add item to cart
PUT    /api/cart/:itemId           - Update cart item quantity
DELETE /api/cart/:itemId           - Remove item from cart
DELETE /api/cart                   - Clear cart
```

### Orders (Customer)
```
GET    /api/orders                 - Get user's orders
GET    /api/orders/:id             - Get single order
POST   /api/orders                 - Create new order (checkout)
```

### Orders (Admin)
```
GET    /api/admin/orders           - List all orders
GET    /api/admin/orders/:id       - Get order details
PUT    /api/admin/orders/:id       - Update order (status, tracking)
```

### Discount Codes
```
POST   /api/discount-codes/validate - Validate a discount code
```

### Discount Codes (Admin)
```
GET    /api/admin/discount-codes   - List all codes
POST   /api/admin/discount-codes   - Create code
PUT    /api/admin/discount-codes/:id - Update code
DELETE /api/admin/discount-codes/:id - Delete code
```

### Reviews (Customer)
```
POST   /api/products/:id/reviews   - Submit review
PUT    /api/reviews/:id            - Update own review
DELETE /api/reviews/:id            - Delete own review
```

### Reviews (Admin)
```
GET    /api/admin/reviews          - List all reviews
PUT    /api/admin/reviews/:id      - Update review (approve, feature, censor)
DELETE /api/admin/reviews/:id      - Delete review
```

### Messages (Customer)
```
GET    /api/conversations          - Get user's conversations
GET    /api/conversations/:id      - Get conversation messages
POST   /api/conversations          - Start new conversation
POST   /api/conversations/:id/messages - Send message
```

### Messages (Admin)
```
GET    /api/admin/conversations    - List all conversations
PUT    /api/admin/conversations/:id - Update conversation status
POST   /api/admin/conversations/:id/messages - Reply to conversation
```

### Notifications
```
GET    /api/notifications          - Get user's notifications
PUT    /api/notifications/:id/read - Mark as read
PUT    /api/notifications/read-all - Mark all as read
```

### Settings (Admin)
```
GET    /api/admin/settings         - Get all settings
PUT    /api/admin/settings/:key    - Update setting
```

### File Upload (Admin)
```
POST   /api/admin/upload           - Upload file (returns URL)
DELETE /api/admin/upload/:filename - Delete file
```

---

## Authentication Requirements

### JWT Token Structure
```json
{
  "sub": "user_id",
  "email": "user@example.com",
  "role": "customer|admin",
  "iat": 1234567890,
  "exp": 1234567890
}
```

### Protected Routes
- All `/api/admin/*` routes require `role: admin`
- Customer routes like `/api/orders`, `/api/cart` require authentication
- Public routes (products, categories) don't require auth

### Role-Based Access
- **customer**: Can view products, manage own cart/orders/reviews/messages
- **admin**: Full access to all admin endpoints

---

## Payment Integration

### Stripe
1. Create a Stripe account
2. Get your API keys (publishable + secret)
3. Implement:
   - Create PaymentIntent on order creation
   - Handle webhook for payment confirmation
   - Store payment_intent_id in orders table

### PayPal
1. Create PayPal Developer account
2. Get Client ID and Secret
3. Implement:
   - Create PayPal order on checkout
   - Capture payment on approval
   - Handle webhooks for payment events

---

## Email Notifications

Send emails for:
- Order confirmation (to customer)
- New order notification (to admin)
- Order status updates (to customer)
- New message notification (to admin/customer)
- Password reset

Recommended services: SendGrid, Mailgun, AWS SES, Resend

---

## File Storage

For product images and uploads, use:
- AWS S3
- Cloudflare R2
- DigitalOcean Spaces
- Or any S3-compatible storage

---

## Search Implementation

For enhanced search, consider:
- PostgreSQL full-text search
- Elasticsearch
- Algolia
- Meilisearch

### Basic PostgreSQL Full-Text Search
```sql
ALTER TABLE products ADD COLUMN search_vector tsvector;

UPDATE products SET search_vector = 
  to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, ''));

CREATE INDEX products_search_idx ON products USING gin(search_vector);

-- Search query
SELECT * FROM products 
WHERE search_vector @@ plainto_tsquery('english', 'search terms');
```

---

## Environment Variables Needed

```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# JWT
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=7d

# Stripe
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PUBLISHABLE_KEY=pk_...

# PayPal (optional)
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...

# Email
SMTP_HOST=...
SMTP_PORT=587
SMTP_USER=...
SMTP_PASS=...
FROM_EMAIL=noreply@gadgetandthread.co

# File Storage
S3_BUCKET=...
S3_REGION=...
S3_ACCESS_KEY=...
S3_SECRET_KEY=...

# App
FRONTEND_URL=https://yoursite.com
API_URL=https://api.yoursite.com
```

---

## Frontend API Configuration

In the frontend code, configure your API base URL in `src/lib/api.ts`:

```typescript
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
```

Then set `VITE_API_URL` in your environment to point to your self-hosted backend.
