import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Truck, Shield, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';
import { ProductGrid } from '@/components/products/ProductGrid';

const Index = () => {
  // Replace mock data with empty arrays for now
  const featuredProducts: any[] = [];
  const newArrivals: any[] = [];
  const categories: any[] = [];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-secondary/30">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Modern Essentials for Modern Living
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Discover curated gadgets and apparel designed for the contemporary lifestyle. 
              Quality meets simplicity.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link to="/products">
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/products?category=electronics">Browse Electronics</Link>
              </Button>
            </div>
          </motion.div>
        </div>

        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
      </section>

      {/* Features */}
      <section className="border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-secondary">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium">Fast Shipping</h3>
                <p className="text-sm text-muted-foreground">Free on orders over $50</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-secondary">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium">Secure Checkout</h3>
                <p className="text-sm text-muted-foreground">100% protected payments</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-secondary">
                <Headphones className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium">24/7 Support</h3>
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
          <ProductGrid products={featuredProducts} columns={4} />
        </div>
      </section>

      {/* Categories */}
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
                    src={category.imageUrl}
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
          <ProductGrid products={newArrivals} columns={4} />
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Stay in the Loop
            </h2>
            <p className="mb-6 text-primary-foreground/80">
              Subscribe for exclusive offers, new arrivals, and insider updates.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-md bg-primary-foreground text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <Button variant="secondary" type="submit">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
