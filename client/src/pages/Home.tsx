import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import ProductCard from '../components/ProductCard';
import type { ProductData } from '../components/ProductCard';
import SkeletonCard from '../components/ui/SkeletonCard';
import { getProducts } from '../services/productService';
import type { ApiProduct } from '../services/productService';
import { getPreferredCategories, getRecentlyViewed } from '../utils/behaviorTracker';

/* ── Constants ── */
const FALLBACK_IMAGE = '/products/headphones.png';
const FEATURED_PRODUCT_COUNT = 8;
const FEATURED_CATEGORY_COUNT = 5;

/* ── Map API product to UI ProductData ── */
const mapProduct = (p: ApiProduct): ProductData => ({
  id: p._id,
  name: p.name,
  price: p.price,
  image: p.images && p.images.length > 0 ? p.images[0] : FALLBACK_IMAGE,
  category: p.category,
  rating: 4.5,
  reviews: 0,
});

/* ========================================
   Home Page — Curated Featured Content
   ======================================== */
const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<ProductData[]>([]);
  const [featuredCategories, setFeaturedCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ── Personalized Recommendations ── */
  const [personalRecs, setPersonalRecs] = useState<ProductData[]>([]);
  const [recsAvailable, setRecsAvailable] = useState(false);

  const fetchFeaturedData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getProducts(undefined, undefined, 1, 50);
      const allProducts = response.data.products.map(mapProduct);

      // Featured products: first N products (newest)
      setFeaturedProducts(allProducts.slice(0, FEATURED_PRODUCT_COUNT));

      // Featured categories: first N unique categories
      const uniqueCategories = Array.from(new Set(allProducts.map((p) => p.category)));
      setFeaturedCategories(uniqueCategories.slice(0, FEATURED_CATEGORY_COUNT));
    } catch {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeaturedData();
  }, [fetchFeaturedData]);

  /* ── Fetch personalized recommendations from behavior data ── */
  useEffect(() => {
    const preferredCategories = getPreferredCategories();
    const recentlyViewed = getRecentlyViewed();

    if (preferredCategories.length === 0) {
      setRecsAvailable(false);
      return;
    }

    const fetchPersonalRecs = async () => {
      try {
        const viewedSet = new Set(recentlyViewed);
        const allRecs: ProductData[] = [];
        const seenIds = new Set<string>();

        // Fetch from top 3 preferred categories
        for (const cat of preferredCategories.slice(0, 3)) {
          const response = await getProducts(undefined, cat, 1, 20);
          const mapped = response.data.products
            .filter((p) => !viewedSet.has(p._id) && !seenIds.has(p._id))
            .map((p) => {
              seenIds.add(p._id);
              return mapProduct(p);
            });
          allRecs.push(...mapped);
        }

        if (allRecs.length > 0) {
          setPersonalRecs(allRecs.slice(0, 8));
          setRecsAvailable(true);
        }
      } catch {
        // Non-critical — silently fail
      }
    };

    fetchPersonalRecs();
  }, []);

  return (
    <div className="bg-neutral-900 min-h-screen">
      {/* ══════════════════════════════════════
         HERO SECTION
         ══════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        {/* Decorative Blobs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-primary-500/8 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-600/6 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-400/3 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-16 sm:py-28 lg:py-36">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-primary-400 rounded-full mr-2 animate-pulse" />
              Multi-Vendor Marketplace
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-neutral-100 tracking-tight leading-tight">
              Discover{' '}
              <span className="text-gradient-gold">Premium</span>
              <br className="hidden sm:block" />
              {' '}Products
            </h1>

            {/* Subtitle */}
            <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-neutral-400 leading-relaxed">
              Curated collections from trusted vendors. Shop smart, shop easy
              — your one-stop destination for everything premium.
            </p>

            {/* CTA */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/products">
                <Button variant="primary" size="lg">
                  Shop Now
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="outline" size="lg">
                  Become a Vendor
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-12 sm:mt-16 grid grid-cols-3 gap-4 sm:gap-8 max-w-md mx-auto">
              {[
                { value: '500+', label: 'Products' },
                { value: '50+', label: 'Vendors' },
                { value: '10K+', label: 'Customers' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl sm:text-3xl font-bold text-primary-400">{stat.value}</p>
                  <p className="mt-1 text-xs sm:text-sm text-neutral-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Divider gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/20 to-transparent" />
      </section>

      {/* ══════════════════════════════════════
         FEATURED CATEGORIES SECTION
         ══════════════════════════════════════ */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-12 sm:pt-16 pb-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-100">
            Featured <span className="text-gradient-gold">Categories</span>
          </h2>
          <p className="mt-3 text-neutral-500 text-sm sm:text-base max-w-xl mx-auto">
            Shop by your favourite category
          </p>
        </div>

        {!loading && (
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-center scrollbar-hide">
            {featuredCategories.map((cat) => (
              <Link
                key={cat}
                to="/products"
                className="px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 whitespace-nowrap min-h-[40px] flex items-center bg-neutral-800 text-neutral-400 border border-neutral-700 hover:border-primary-500/30 hover:text-primary-400"
              >
                {cat}
              </Link>
            ))}
            <Link
              to="/products"
              className="px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 whitespace-nowrap min-h-[40px] flex items-center bg-primary-500/10 text-primary-400 border border-primary-500/30 hover:bg-primary-500/20"
            >
              View All →
            </Link>
          </div>
        )}
      </section>

      {/* ══════════════════════════════════════
         FEATURED PRODUCTS SECTION
         ══════════════════════════════════════ */}
      <section id="products" className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-100">
              Featured <span className="text-gradient-gold">Products</span>
            </h2>
            <p className="mt-2 text-neutral-500 text-sm sm:text-base">
              Handpicked premium products from our top-rated vendors
            </p>
          </div>
          <Link
            to="/products"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-primary-400 hover:text-primary-300 transition-colors duration-200"
          >
            View All
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: FEATURED_PRODUCT_COUNT }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-400 mb-4">Failed to load products</p>
            <Button variant="outline" size="sm" onClick={() => fetchFeaturedData()}>
              Retry
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* View All Products CTA */}
        <div className="text-center mt-12">
          <Link to="/products">
            <Button variant="outline" size="lg">
              View All Products →
            </Button>
          </Link>
        </div>
      </section>

      {/* ══════════════════════════════════════
         RECOMMENDED FOR YOU
         ══════════════════════════════════════ */}
      {recsAvailable && personalRecs.length > 0 && (
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                <span className="text-[10px] font-bold text-primary-400 uppercase tracking-widest">Personalized</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-100">
                Recommended <span className="text-gradient-gold">for You</span>
              </h2>
              <p className="mt-2 text-neutral-500 text-sm sm:text-base">
                Based on your browsing history
              </p>
            </div>
            <Link
              to="/products"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-primary-400 hover:text-primary-300 transition-colors duration-200"
            >
              View All
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {personalRecs.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════
         FEATURES STRIP
         ══════════════════════════════════════ */}
      <section className="border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
            {[
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                ),
                title: 'Free Shipping',
                desc: 'On orders over ₹500',
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: 'Secure Payment',
                desc: '100% secure checkout',
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                ),
                title: 'Easy Returns',
                desc: '30-day return policy',
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ),
                title: '24/7 Support',
                desc: 'Dedicated help center',
              },
            ].map((feature) => (
              <div key={feature.title} className="flex flex-col items-center text-center group">
                <div className="w-12 h-12 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-primary-400 mb-3 group-hover:border-primary-500/30 group-hover:shadow-gold transition-all duration-300">
                  {feature.icon}
                </div>
                <h4 className="text-sm font-semibold text-neutral-200">{feature.title}</h4>
                <p className="text-xs text-neutral-500 mt-1">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
