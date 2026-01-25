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

## ⚠️ CRITICAL: Admin Access Security

### Secure Role Management

**NEVER** store roles in the users table or check admin status on the frontend. Use a separate roles table:

```sql
-- Create role enum
CREATE TYPE app_role AS ENUM ('admin', 'customer');

-- Create user_roles table
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Security definer function to check roles (prevents recursive queries)
CREATE OR REPLACE FUNCTION has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;
```

### Granting Admin Access (Manual DB Edit)

To make yourself an admin, run this SQL in your database:

```sql
-- Replace 'your-user-id' with your actual user ID from the users table
INSERT INTO user_roles (user_id, role) 
VALUES ('your-user-id', 'admin');
```

Or find your user first:
```sql
SELECT id, email FROM users WHERE email = 'your-email@example.com';
-- Then insert with the returned ID
INSERT INTO user_roles (user_id, role) VALUES ('<returned-id>', 'admin');
```

### Backend Middleware Example (Node.js/Express)

```javascript
// Middleware to check admin role
const requireAdmin = async (req, res, next) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Check role in database
  const result = await db.query(
    'SELECT * FROM user_roles WHERE user_id = $1 AND role = $2',
    [userId, 'admin']
  );
  
  if (result.rows.length === 0) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  
  next();
};

// Apply to admin routes
app.use('/api/admin/*', requireAdmin);
```

---

## Payment Integration (CRITICAL)

### Stripe Integration Steps

1. **Create Stripe Account**: Go to stripe.com and create an account
2. **Get API Keys**: Dashboard → Developers → API Keys
3. **Install Stripe SDK**: `npm install stripe`

### Backend Payment Flow (Node.js Example)

```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// POST /api/orders - Create order with payment
app.post('/api/orders', async (req, res) => {
  const { items, shippingAddress, discountCode } = req.body;
  const userId = req.user.id;
  
  // 1. Calculate totals on SERVER (never trust client prices!)
  let subtotal = 0;
  const orderItems = [];
  
  for (const item of items) {
    // Fetch product from DB to get real price
    const product = await db.query('SELECT * FROM products WHERE id = $1', [item.productId]);
    if (!product.rows[0]) throw new Error('Product not found');
    
    const realPrice = product.rows[0].price;
    const itemTotal = realPrice * item.quantity;
    subtotal += itemTotal;
    
    orderItems.push({
      product_id: item.productId,
      product_name: product.rows[0].name,
      quantity: item.quantity,
      unit_price: realPrice,
      total_price: itemTotal,
      shipping_cost: product.rows[0].is_free_shipping ? 0 : product.rows[0].shipping_cost
    });
  }
  
  // 2. Calculate shipping and discounts
  const shippingTotal = orderItems.reduce((sum, item) => sum + item.shipping_cost * item.quantity, 0);
  let discountTotal = 0;
  
  if (discountCode) {
    const discount = await validateDiscount(discountCode, subtotal);
    if (discount) {
      discountTotal = discount.type === 'percentage' 
        ? subtotal * (discount.value / 100)
        : discount.value;
    }
  }
  
  const grandTotal = subtotal + shippingTotal - discountTotal;
  
  // 3. Create Stripe PaymentIntent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(grandTotal * 100), // Stripe uses cents
    currency: 'usd',
    metadata: { user_id: userId }
  });
  
  // 4. Create order in database with 'pending' payment status
  const order = await db.query(`
    INSERT INTO orders (
      user_id, order_number, subtotal, shipping_total, discount_total, grand_total,
      payment_intent_id, payment_status, status, ...shipping fields
    ) VALUES ($1, $2, $3, ...) RETURNING *
  `, [userId, generateOrderNumber(), subtotal, shippingTotal, discountTotal, grandTotal, paymentIntent.id, 'pending', 'pending', ...]);
  
  // 5. Insert order items
  for (const item of orderItems) {
    await db.query('INSERT INTO order_items (...) VALUES (...)', [...]);
  }
  
  // 6. Return client secret for frontend to complete payment
  res.json({
    orderId: order.rows[0].id,
    clientSecret: paymentIntent.client_secret
  });
});
```

### Stripe Webhook Handler (CRITICAL for payment confirmation)

```javascript
// POST /api/webhooks/stripe
app.post('/api/webhooks/stripe', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      
      // Update order status to paid
      await db.query(`
        UPDATE orders 
        SET payment_status = 'paid', status = 'processing'
        WHERE payment_intent_id = $1
      `, [paymentIntent.id]);
      
      // Send confirmation email
      await sendOrderConfirmationEmail(order);
    }
    
    if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object;
      await db.query(`
        UPDATE orders SET payment_status = 'failed'
        WHERE payment_intent_id = $1
      `, [paymentIntent.id]);
    }
    
    res.json({ received: true });
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});
```

### Frontend Payment Completion

Update `src/pages/Checkout.tsx` to use Stripe Elements:

```typescript
// Install: npm install @stripe/stripe-js @stripe/react-stripe-js

import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// In checkout, after user submits:
const { orderId, clientSecret } = await api.createOrder(orderData);

// Then use clientSecret with Stripe Elements to complete payment
const stripe = useStripe();
const { error } = await stripe.confirmPayment({
  elements,
  confirmParams: { return_url: `${window.location.origin}/order-confirmation/${orderId}` }
});
```

---

## Order History Implementation

Ensure orders are returned to users:

```javascript
// GET /api/orders
app.get('/api/orders', async (req, res) => {
  const userId = req.user.id;
  
  const orders = await db.query(`
    SELECT o.*, 
      json_agg(json_build_object(
        'id', oi.id,
        'product_name', oi.product_name,
        'quantity', oi.quantity,
        'unit_price', oi.unit_price,
        'product_image_url', oi.product_image_url
      )) as items
    FROM orders o
    LEFT JOIN order_items oi ON oi.order_id = o.id
    WHERE o.user_id = $1
    GROUP BY o.id
    ORDER BY o.created_at DESC
  `, [userId]);
  
  res.json(orders.rows);
});
```

---

## Messages System

```javascript
// POST /api/conversations - Create conversation
app.post('/api/conversations', async (req, res) => {
  const { subject, message, productId } = req.body;
  const userId = req.user.id;
  
  const conv = await db.query(`
    INSERT INTO conversations (user_id, subject, product_id, last_message_at)
    VALUES ($1, $2, $3, NOW()) RETURNING *
  `, [userId, subject, productId]);
  
  await db.query(`
    INSERT INTO messages (conversation_id, sender_id, sender_type, content)
    VALUES ($1, $2, 'customer', $3)
  `, [conv.rows[0].id, userId, message]);
  
  // Notify admin via email
  await sendEmailToAdmin('New message', { subject, message, userId });
  
  res.json(conv.rows[0]);
});
```

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

# Stripe (REQUIRED for payments)
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

---

## Quick Checklist to Get Started

1. [ ] Set up PostgreSQL database
2. [ ] Run the CREATE TABLE statements above
3. [ ] Create your user account
4. [ ] **Run the INSERT INTO user_roles SQL to make yourself admin**
5. [ ] Set up Stripe account and get API keys
6. [ ] Implement the API endpoints (Node.js/Express, Python/FastAPI, etc.)
7. [ ] Set up Stripe webhook endpoint
8. [ ] Configure email service
9. [ ] Set VITE_API_URL in frontend environment
10. [ ] Test the full order flow
