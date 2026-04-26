import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import ProductCard from '../components/ProductCard';
import type { ProductData } from '../components/ProductCard';

/* ── Mock Data ── */
const PRODUCTS: ProductData[] = [
  {
    id: 1,
    name: 'Noir Pro Headphones',
    price: 249.99,
    originalPrice: 349.99,
    image: '/products/headphones.png',
    category: 'Audio',
    rating: 4.8,
    reviews: 324,
    badge: 'Best Seller',
  },
  {
    id: 2,
    name: 'Luxe Smartwatch',
    price: 399.99,
    image: '/products/watch.png',
    category: 'Wearables',
    rating: 4.9,
    reviews: 518,
    badge: 'New',
  },
  {
    id: 3,
    name: 'Urban Stealth Sneakers',
    price: 189.99,
    originalPrice: 229.99,
    image: '/products/sneakers.png',
    category: 'Footwear',
    rating: 4.7,
    reviews: 206,
  },
  {
    id: 4,
    name: 'Heritage Leather Bag',
    price: 299.99,
    image: '/products/bag.png',
    category: 'Accessories',
    rating: 4.6,
    reviews: 142,
  },
  {
    id: 5,
    name: 'Aviator Gold Sunglasses',
    price: 159.99,
    originalPrice: 199.99,
    image: '/products/sunglasses.png',
    category: 'Eyewear',
    rating: 4.5,
    reviews: 97,
    badge: 'Sale',
  },
  {
    id: 6,
    name: 'Shadow Wireless Earbuds',
    price: 129.99,
    image: '/products/earbuds.png',
    category: 'Audio',
    rating: 4.4,
    reviews: 263,
  },
  {
    id: 7,
    name: 'Atlas Travel Backpack',
    price: 179.99,
    image: '/products/backpack.png',
    category: 'Bags',
    rating: 4.8,
    reviews: 185,
    badge: 'Trending',
  },
  {
    id: 8,
    name: 'Monarch Leather Wallet',
    price: 89.99,
    originalPrice: 119.99,
    image: '/products/wallet.png',
    category: 'Accessories',
    rating: 4.3,
    reviews: 74,
  },
];

const CATEGORIES = ['All', 'Audio', 'Wearables', 'Footwear', 'Accessories', 'Eyewear', 'Bags'];

/* ========================================
   Home Page
   ======================================== */
const Home: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProducts =
    activeCategory === 'All'
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === activeCategory);

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

        <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-20 sm:py-28 lg:py-36">
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
              <a href="#products">
                <Button variant="primary" size="lg">
                  Shop Now
                </Button>
              </a>
              <Link to="/signup">
                <Button variant="outline" size="lg">
                  Become a Vendor
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto">
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
         PRODUCTS SECTION
         ══════════════════════════════════════ */}
      <section id="products" className="relative max-w-7xl mx-auto px-4 md:px-8 py-16 sm:py-20">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-100">
            Featured <span className="text-gradient-gold">Products</span>
          </h2>
          <p className="mt-3 text-neutral-500 text-sm sm:text-base max-w-xl mx-auto">
            Handpicked premium products from our top-rated vendors
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-primary-500 text-neutral-900 shadow-gold'
                  : 'bg-neutral-800 text-neutral-400 border border-neutral-700 hover:border-primary-500/30 hover:text-primary-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Empty state */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-800 border border-neutral-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <p className="text-neutral-500 text-base">No products in this category yet.</p>
          </div>
        )}

        {/* View All */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            View All Products →
          </Button>
        </div>
      </section>

      {/* ══════════════════════════════════════
         FEATURES STRIP
         ══════════════════════════════════════ */}
      <section className="border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                ),
                title: 'Free Shipping',
                desc: 'On orders over $100',
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
