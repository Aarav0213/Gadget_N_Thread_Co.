import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { ProductGrid } from '@/components/products/ProductGrid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { supabase } from '@/lib/api';
import type { Product, Category } from '@/lib/api';

type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'popular' | 'rating';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Database data
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Get filters from URL
  const searchQuery = searchParams.get('search') || '';
  const categoryFilter = searchParams.get('category') || '';
  const sortBy = (searchParams.get('sort') as SortOption) || 'newest';
  const minPriceParam = searchParams.get('minPrice');
  const maxPriceParam = searchParams.get('maxPrice');

  // Local filter state
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    minPriceParam ? Number(minPriceParam) : 0,
    maxPriceParam ? Number(maxPriceParam) : 500,
  ]);
  const [inStockOnly, setInStockOnly] = useState(false);

  // Fetch products and categories from Supabase
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          supabase
            .from('products')
            .select(`
              *,
              category:categories(*),
              images:product_images(*)
            `)
            .eq('is_active', true),
          supabase
            .from('categories')
            .select('*')
            .eq('is_active', true)
            .order('display_order'),
        ]);

        setProducts(productsRes.data || []);
        setCategories(categoriesRes.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const maxProductPrice = Math.max(...products.map((p) => p.price), 500);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (categoryFilter) {
      filtered = filtered.filter((p) => 
        p.category_id === categoryFilter || p.category?.slug === categoryFilter
      );
    }
    if (searchQuery) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (priceRange[0] > 0) {
      filtered = filtered.filter((p) => p.price >= priceRange[0]);
    }
    if (priceRange[1] < maxProductPrice) {
      filtered = filtered.filter((p) => p.price <= priceRange[1]);
    }
    if (inStockOnly) {
      filtered = filtered.filter((p) => p.is_in_stock);
    }

    switch (sortBy) {
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => 
          new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
        );
        break;
      case 'rating':
        filtered.sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0));
        break;
      case 'popular':
        filtered.sort((a, b) => (b.review_count || 0) - (a.review_count || 0));
        break;
    }

    return filtered;
  }, [products, categoryFilter, searchQuery, sortBy, priceRange, inStockOnly, maxProductPrice]);

  const updateFilter = (key: string, value: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set(key, value);
    else newParams.delete(key);
    setSearchParams(newParams);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilter('search', localSearch || null);
  };

  const clearFilters = () => {
    setSearchParams({});
    setLocalSearch('');
    setPriceRange([0, maxProductPrice]);
    setInStockOnly(false);
  };

  const activeFilterCount = [
    categoryFilter,
    searchQuery,
    priceRange[0] > 0 ? 'minPrice' : null,
    priceRange[1] < maxProductPrice ? 'maxPrice' : null,
    inStockOnly ? 'inStock' : null,
  ].filter(Boolean).length;

  const FilterContent = () => (
    <div className="space-y-6">
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 font-medium">
          Categories
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 space-y-2">
          <button
            onClick={() => updateFilter('category', null)}
            className={`block text-sm w-full text-left py-1 ${
              !categoryFilter ? 'font-medium text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            All Categories
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => updateFilter('category', category.slug)}
              className={`block text-sm w-full text-left py-1 ${
                categoryFilter === category.slug || categoryFilter === category.id
                  ? 'font-medium text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {category.name}
            </button>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Price Range */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 font-medium">
          Price Range
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4 space-y-4">
          <Slider
            value={priceRange}
            onValueChange={(value) => setPriceRange(value as [number, number])}
            min={0}
            max={maxProductPrice}
            step={10}
            className="w-full"
          />
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Label htmlFor="minPrice" className="text-xs text-muted-foreground">Min</Label>
              <Input
                id="minPrice"
                type="number"
                min={0}
                max={priceRange[1]}
                value={priceRange[0]}
                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                className="h-8 text-sm"
              />
            </div>
            <span className="text-muted-foreground mt-5">–</span>
            <div className="flex-1">
              <Label htmlFor="maxPrice" className="text-xs text-muted-foreground">Max</Label>
              <Input
                id="maxPrice"
                type="number"
                min={priceRange[0]}
                max={maxProductPrice}
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="h-8 text-sm"
              />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Availability */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 font-medium">
          Availability
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2">
          <div className="flex items-center gap-2">
            <Checkbox
              id="inStock"
              checked={inStockOnly}
              onCheckedChange={(checked) => setInStockOnly(checked as boolean)}
            />
            <Label htmlFor="inStock" className="text-sm">In Stock Only</Label>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {activeFilterCount > 0 && (
        <Button variant="outline" className="w-full" onClick={clearFilters}>
          Clear All Filters ({activeFilterCount})
        </Button>
      )}
    </div>
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            {categoryFilter
              ? categories.find((c) => c.slug === categoryFilter || c.id === categoryFilter)?.name || 'Products'
              : 'All Products'}
          </h1>
          {searchQuery && (
            <p className="text-muted-foreground mt-2">
              Search results for "{searchQuery}"
            </p>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 min-w-[200px] max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </form>

          {/* Sort */}
          <Select value={sortBy} onValueChange={(value) => updateFilter('sort', value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
            </SelectContent>
          </Select>

          {/* Mobile Filters */}
          <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" className="gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <FilterContent />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Active Filters */}
        <AnimatePresence>
          {(searchQuery || categoryFilter) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-wrap gap-2 mb-6"
            >
              {searchQuery && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    updateFilter('search', null);
                    setLocalSearch('');
                  }}
                  className="gap-1"
                >
                  Search: {searchQuery}
                  <X className="h-3 w-3" />
                </Button>
              )}
              {categoryFilter && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => updateFilter('category', null)}
                  className="gap-1"
                >
                  {categories.find((c) => c.slug === categoryFilter || c.id === categoryFilter)?.name}
                  <X className="h-3 w-3" />
                </Button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <FilterContent />
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <p className="text-muted-foreground">Loading products...</p>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-4">
                  {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                </p>
                <ProductGrid products={filteredProducts} columns={3} />
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products;
