import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  ShoppingBag,
  Heart,
  Share2,
  Truck,
  MessageCircle,
  Star,
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StarRating } from '@/components/products/StarRating';
import { ProductGrid } from '@/components/products/ProductGrid';
import { useCartStore } from '@/stores/cartStore';
import { productsApi, reviewsApi } from '@/lib/api';
import type { Product, Review } from '@/lib/api';
import { toast } from 'sonner';

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;
      
      setLoading(true);
      try {
        const productData = await productsApi.getBySlug(slug);
        setProduct(productData);

        // Fetch reviews
        if (productData?.id) {
          const reviewsData = await reviewsApi.listForProduct(productData.id);
          setReviews(reviewsData || []);
        }

        // Fetch related products
        const allProducts = await productsApi.list();
        const related = allProducts
          ?.filter((p: Product) => p.category_id === productData?.category_id && p.id !== productData?.id)
          .slice(0, 4) || [];
        setRelatedProducts(related);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    setQuantity(1);
    setCurrentImageIndex(0);
  }, [slug]);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-muted-foreground">Loading product...</p>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The product you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link to="/products">Browse Products</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const images = product.images?.length
    ? product.images
    : [
        {
          id: 'placeholder',
          image_url: '/placeholder.svg',
          alt_text: product.name,
          display_order: 0,
          is_primary: true,
        },
      ];

  const hasDiscount =
    typeof product.compare_at_price === 'number' &&
    product.compare_at_price > product.price;

  const discountPercent = hasDiscount
    ? Math.round(
        ((product.compare_at_price! - product.price) /
          product.compare_at_price!) *
          100
      )
    : 0;

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast.success(
      `Added ${quantity} item${quantity > 1 ? 's' : ''} to cart`
    );
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + images.length) % images.length
    );
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-foreground">Products</Link>
          {product.category && (
            <>
              <span>/</span>
              <Link
                to={`/products?category=${product.category.slug}`}
                className="hover:text-foreground"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative h-[500px] overflow-hidden rounded-lg bg-secondary/30 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImageIndex}
                  src={images[currentImageIndex].image_url}
                  alt={images[currentImageIndex].alt_text || product.name}
                  className="max-h-full max-w-full object-contain"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />
              </AnimatePresence>

              {images.length > 1 && (
                <>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </>
              )}

              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {hasDiscount && (
                  <Badge variant="destructive">-{discountPercent}% OFF</Badge>
                )}
                {product.is_free_shipping && (
                  <Badge variant="secondary">Free Shipping</Badge>
                )}
              </div>
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-20 h-20 rounded-md overflow-hidden border-2 ${
                      currentImageIndex === index
                        ? 'border-primary'
                        : 'border-transparent hover:border-muted-foreground/50'
                    }`}
                  >
                    <img
                      src={image.image_url}
                      alt={image.alt_text || product.name}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">
                {product.category?.name}
              </p>
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

              {typeof product.average_rating === 'number' && (
                <div className="flex items-center gap-2 mb-4">
                  <StarRating rating={product.average_rating} size="md" />
                  <span className="text-sm font-medium">
                    {product.average_rating.toFixed(1)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    ({product.review_count} reviews)
                  </span>
                </div>
              )}

              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold">
                  ${product.price.toFixed(2)}
                </span>
                {hasDiscount && (
                  <span className="text-xl text-muted-foreground line-through">
                    ${product.compare_at_price!.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            <Separator />

            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-medium">Quantity</span>
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity((q) => q + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  size="lg"
                  className="flex-1 gap-2"
                  onClick={handleAddToCart}
                  disabled={!product.is_in_stock}
                >
                  <ShoppingBag className="h-5 w-5" />
                  {product.is_in_stock ? 'Add to Cart' : 'Out of Stock'}
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={(e) => {
                    e.preventDefault();
                    toast.success('Saved to wishlist! (Wishlist feature coming soon)');
                  }}
                >
                  <Heart className="h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={async (e) => {
                    e.preventDefault();
                    const url = window.location.href;
                    try {
                      await navigator.clipboard.writeText(url);
                      toast.success('Link copied to clipboard!');
                    } catch {
                      // Fallback for older browsers
                      toast.info(`Share this link: ${url}`);
                    }
                  }}
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <Separator />

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-muted-foreground" />
                {product.is_free_shipping ? (
                  <span>Free shipping on this item</span>
                ) : (
                  <span>
                    Shipping: $
                    {(product.shipping_cost ?? 0).toFixed(2)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <MessageCircle className="h-5 w-5 text-muted-foreground" />
                <Button
                  variant="link"
                  className="p-0 h-auto"
                  onClick={() => navigate('/contact')}
                >
                  Contact us about this product
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description">
            <TabsList>
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="reviews">
                Reviews ({reviews.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              {reviews.length === 0 ? (
                <div className="text-center py-12">
                  <Star className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">
                    No reviews yet. Be the first to review!
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b pb-6 last:border-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">
                              {review.user_name || 'Anonymous'}
                            </span>
                            {review.is_verified_purchase && (
                              <Badge variant="secondary" className="text-xs">
                                Verified Purchase
                              </Badge>
                            )}
                          </div>
                          <StarRating rating={review.rating} size="sm" />
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {review.title && (
                        <h4 className="font-medium mt-3">
                          {review.title}
                        </h4>
                      )}
                      <p className="text-muted-foreground mt-2">
                        {review.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-8">
              You May Also Like
            </h2>
            <ProductGrid products={relatedProducts} columns={4} />
          </section>
        )}
      </div>
    </Layout>
  );
};

export default ProductDetail;
