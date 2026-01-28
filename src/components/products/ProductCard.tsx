import { Link } from 'react-router-dom';
import { Star, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/stores/cartStore';
import type { Product } from '@/lib/api';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const primaryImage = product.images?.find((img) => img.is_primary) || product.images?.[0];
  const hasDiscount = product.compare_at_price && product.compare_at_price > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.compare_at_price! - product.price) / product.compare_at_price!) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn('group', className)}
    >
      <Link to={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-secondary/30">
          {primaryImage && (
            <img
              src={primaryImage.image_url}
              alt={primaryImage.alt_text || product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {hasDiscount && (
              <Badge variant="destructive" className="text-xs font-medium">
                -{discountPercent}%
              </Badge>
            )}
            {product.is_free_shipping && (
              <Badge variant="secondary" className="text-xs font-medium bg-background/90">
                Free Shipping
              </Badge>
            )}
          </div>

          {/* Quick Add Button */}
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              size="icon"
              onClick={handleAddToCart}
              disabled={!product.is_in_stock}
              className="h-10 w-10 rounded-full shadow-lg"
            >
              <ShoppingBag className="h-4 w-4" />
            </Button>
          </div>

          {/* Out of Stock Overlay */}
          {!product.is_in_stock && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <span className="text-muted-foreground font-medium">Out of Stock</span>
            </div>
          )}
        </div>

        <div className="mt-4 space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">
            {product.category?.name}
          </p>
          <h3 className="font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          
          {/* Rating */}
          {product.average_rating && (
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-primary text-primary" />
              <span className="text-sm font-medium">{product.average_rating.toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">({product.review_count})</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2 pt-1">
            <span className="font-semibold text-foreground">${product.price.toFixed(2)}</span>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.compare_at_price!.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
