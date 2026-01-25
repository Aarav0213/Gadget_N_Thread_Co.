import { useState, useMemo } from 'react';
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
import { mockProducts, mockCategories, filterProducts, sortProducts } from '@/lib/mockData';

type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'popular' | 'rating';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  
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

  // Get price range from products
  const maxProductPrice = Math.max(...mockProducts.map((p) => p.price));

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    const filtered = filterProducts(mockProducts, {
      category: categoryFilter,
      search: searchQuery,
      minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
      maxPrice: priceRange[1] < 500 ? priceRange[1] : undefined, // 500 means no upper limit
      inStock: inStockOnly || undefined,
    });
    return sortProducts(filtered, sortBy);
  }, [categoryFilter, searchQuery, sortBy, priceRange, inStockOnly]);

  const updateFilter = (key: string, value: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
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
      {/* Categories */}
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
          {mockCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => updateFilter('category', category.slug)}
              className={`block text-sm w-full text-left py-1 ${
                categoryFilter === category.slug
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
            max={500}
            step={10}
            className="w-full"
          />
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Label htmlFor="minPrice" className="text-xs text-muted-foreground">Min</Label>
              <div className="relative">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                <Input
                  id="minPrice"
                  type="number"
                  min={0}
                  max={priceRange[1]}
                  value={priceRange[0]}
                  onChange={(e) => {
                    const val = Math.min(Number(e.target.value) || 0, priceRange[1]);
                    setPriceRange([val, priceRange[1]]);
                  }}
                  className="pl-5 h-8 text-sm"
                />
              </div>
            </div>
            <span className="text-muted-foreground mt-5">–</span>
            <div className="flex-1">
              <Label htmlFor="maxPrice" className="text-xs text-muted-foreground">Max</Label>
              <div className="relative">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                <Input
                  id="maxPrice"
                  type="number"
                  min={priceRange[0]}
                  max={500}
                  value={priceRange[1]}
                  onChange={(e) => {
                    const val = Math.max(Number(e.target.value) || 0, priceRange[0]);
                    setPriceRange([priceRange[0], Math.min(val, 500)]);
                  }}
                  className="pl-5 h-8 text-sm"
                />
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            {priceRange[1] >= 500 ? '$500+ (no upper limit)' : `Up to $${priceRange[1]}`}
          </p>
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
            <Label htmlFor="inStock" className="text-sm">
              In Stock Only
            </Label>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Clear Filters */}
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
              ? mockCategories.find((c) => c.slug === categoryFilter)?.name || 'Products'
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
                  {mockCategories.find((c) => c.slug === categoryFilter)?.name}
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
            <p className="text-sm text-muted-foreground mb-4">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
            </p>
            <ProductGrid products={filteredProducts} columns={3} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products;
