import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Truck, Shield, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';
import { ProductGrid } from '@/components/products/ProductGrid';
import { supabase } from '@/lib/api';
import type { Product, Category } from '@/lib/api';

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch products with images
        const { data: productsData } = await supabase
          .from('products')
          .select(`
            *,
            category:categories(*),
            images:product_images(*)
          `)
          .eq('is_active', true)
          .order('created_at', { ascending: false });
        
        setProducts(productsData || []);

        // Fetch categories
        const { data: categoriesData } = await supabase
          .from('categories')
          .select('*')
          .eq('is_active', true)
          .order('display_order');
        
        setCategories(categoriesData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const featuredProducts = products.filter(p => p.is_featured).slice(0, 4);
  const newArrivals = products.slice(0, 8);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-secondary/50 to-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            >
              Discover Premium Gadgets & Threads
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg text-muted-foreground mb-8"
            >
              Curated selection of the finest tech accessories and lifestyle products, delivered to your door.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex gap-4"
            >
              <Button size="lg" asChild>
                <Link to="/products">
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/products?featured=true">View Featured</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Free Shipping</h3>
                <p className="text-sm text-muted-foreground">On select items</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Secure Checkout</h3>
                <p className="text-sm text-muted-foreground">100% protected payments</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Headphones className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">24/7 Support</h3>
                <p className="text-sm text-muted-foreground">We're here to help</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Featured Products</h2>
              <p className="text-muted-foreground mt-1">Handpicked favorites</p>
            </div>
            <Button variant="ghost" asChild>
              <Link to="/products?featured=true">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          {loading ? (
            <p className="text-muted-foreground">Loading products...</p>
          ) : featuredProducts.length > 0 ? (
            <ProductGrid products={featuredProducts} columns={4} />
          ) : (
            <ProductGrid products={newArrivals.slice(0, 4)} columns={4} />
          )}
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold">Shop by Category</h2>
              <p className="text-muted-foreground mt-2">Find exactly what you're looking for</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Link
                    to={`/products?category=${category.slug}`}
                    className="group block relative aspect-square overflow-hidden rounded-lg"
                  >
                    <img
                      src={category.image_url || '/placeholder.svg'}
                      alt={category.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                      <p className="text-sm text-white/80 mt-1 line-clamp-1">{category.description}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* New Arrivals */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">New Arrivals</h2>
              <p className="text-muted-foreground mt-1">The latest additions to our collection</p>
            </div>
            <Button variant="ghost" asChild>
              <Link to="/products?sort=newest">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          {loading ? (
            <p className="text-muted-foreground">Loading products...</p>
          ) : (
            <ProductGrid products={newArrivals} columns={4} />
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Stay in the Loop</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-md mx-auto">
            Subscribe to our newsletter for exclusive deals, new arrivals, and insider updates.
          </p>
          <div className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-md text-foreground"
            />
            <Button variant="secondary">Subscribe</Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
