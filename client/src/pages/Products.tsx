import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import type { ProductData } from '../components/ProductCard';
import SkeletonCard from '../components/ui/SkeletonCard';
import EmptyState from '../components/ui/EmptyState';
import { getProducts } from '../services/productService';
import type { ApiProduct } from '../services/productService';

/* ── Fallback product image ── */
const FALLBACK_IMAGE = '/products/headphones.png';

/* ── Map API product to UI ProductData ── */
const mapProduct = (p: ApiProduct): ProductData => ({
  id: p._id,
  name: p.name,
  price: p.price,
  image: p.images && p.images.length > 0 ? p.images[0] : FALLBACK_IMAGE,
  category: p.category,
  rating: 4.5,
  reviews: 0,
  vendorName: p.vendor?.name,
});

/* ========================================
   Products Page — Full Catalog
   ======================================== */
const Products: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<ProductData[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [searchInterpretation, setSearchInterpretation] = useState<string | null>(null);
  const initialCategoryApplied = useRef(false);

  const fetchProducts = useCallback(async (keyword?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getProducts(keyword, undefined, 1, 50);
      const mapped = response.data.products.map(mapProduct);
      setProducts(mapped);
      setSearchInterpretation(response.data.searchInterpretation || null);

      // Extract unique categories from API data
      const cats = ['All', ...Array.from(new Set(mapped.map((p) => p.category)))];
      setCategories(cats);
    } catch {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  /* ── Scroll to top on mount (fixes "View All" landing mid-page) ── */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  /* ── Auto-apply category from query param (e.g. /products?category=Electronics) ── */
  useEffect(() => {
    if (initialCategoryApplied.current) return;
    const catParam = searchParams.get('category');
    if (catParam && categories.length > 1) {
      const match = categories.find(
        (c) => c.toLowerCase() === catParam.toLowerCase(),
      );
      if (match) {
        setActiveCategory(match);
      }
      initialCategoryApplied.current = true;
    }
  }, [searchParams, categories]);

  const handleSearch = useCallback(() => {
    setActiveCategory('All');
    fetchProducts(searchTerm || undefined);
  }, [searchTerm, fetchProducts]);

  const handleSearchKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') handleSearch();
    },
    [handleSearch],
  );

  const handleClearSearch = useCallback(() => {
    setSearchTerm('');
    setActiveCategory('All');
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts =
    activeCategory === 'All'
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <div className="bg-neutral-900 min-h-screen">
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-20">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-100">
            Shop from Local Vendors{' '}
            <span className="text-gradient-gold">in Jabalpur</span>
          </h1>
          <p className="mt-4 text-neutral-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Discover products from trusted shops and businesses across your city.
          </p>
        </div>

        {/* Search Input */}
        <div className="flex justify-center mb-6">
          <div className="relative w-full md:w-96">
            {/* Search Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500 pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search local products and shops..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="w-full pl-10 pr-10 py-3 rounded-lg border border-neutral-700 bg-neutral-800/80 text-neutral-100 placeholder-neutral-500 text-sm focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300 min-h-[44px]"
            />
            {/* Clear Button */}
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Smart Search Interpretation */}
        {searchInterpretation && (
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-500/10 border border-primary-500/20 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              <span className="text-primary-400 font-medium">Smart search:</span>
              <span className="text-neutral-300">{searchInterpretation}</span>
            </div>
          </div>
        )}

        {/* Category Filter — Local Shop Categories */}
        <div className="flex gap-2 mb-10 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-center scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 whitespace-nowrap min-h-[40px] flex items-center ${activeCategory === cat
                ? 'bg-primary-500 text-neutral-900 shadow-gold'
                : 'bg-neutral-800 text-neutral-400 border border-neutral-700 hover:border-primary-500/30 hover:text-primary-400'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid — FULL dataset */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <EmptyState
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            }
            title="Failed to load products"
            description="Something went wrong. Please try again."
            actionLabel="Retry"
            onAction={() => fetchProducts()}
          />
        ) : filteredProducts.length === 0 ? (
          <EmptyState
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-neutral-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            }
            title="No local products found right now"
            description="Try exploring different categories or check back soon."
            actionLabel="Clear Filters"
            onAction={handleClearSearch}
          />
        ) : (
          <>
            {/* Results count */}
            <p className="text-neutral-500 text-sm mb-6 text-center">
              Showing {filteredProducts.length} local product{filteredProducts.length !== 1 ? 's' : ''}
              {activeCategory !== 'All' ? ` in ${activeCategory}` : ' from Jabalpur vendors'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default Products;
