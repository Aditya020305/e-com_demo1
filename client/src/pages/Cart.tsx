import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../store/CartContext';
import { useAuth } from '../hooks/useAuth';
import { getProducts } from '../services/productService';
import type { ApiProduct } from '../services/productService';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';

/* ========================================
   Cart Page
   ======================================== */
const Cart: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, addToCart, totalPrice, loading } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  /* ── Frequently Bought Together ── */
  const [suggestions, setSuggestions] = useState<ApiProduct[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [addingSuggestionId, setAddingSuggestionId] = useState<string | null>(null);

  useEffect(() => {
    if (cartItems.length === 0) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      setSuggestionsLoading(true);
      try {
        const cartProductIds = new Set(cartItems.map((item) => item.id));

        // Fetch a broad set of products
        const response = await getProducts(undefined, undefined, 1, 50);
        const allProducts = response.data.products;

        // Find categories of products currently in cart
        const cartCategories = new Set(
          allProducts
            .filter((p) => cartProductIds.has(p._id))
            .map((p) => p.category)
        );

        // Suggest products from the same categories, excluding cart items
        const candidates = allProducts.filter(
          (p) => cartCategories.has(p.category) && !cartProductIds.has(p._id)
        );

        // If not enough same-category results, backfill with other products
        if (candidates.length < 4) {
          const backfill = allProducts.filter(
            (p) => !cartCategories.has(p.category) && !cartProductIds.has(p._id)
          );
          candidates.push(...backfill.slice(0, 6 - candidates.length));
        }

        setSuggestions(candidates.slice(0, 6));
      } catch {
        setSuggestions([]);
      } finally {
        setSuggestionsLoading(false);
      }
    };

    fetchSuggestions();
  }, [cartItems]);

  const handleAddSuggestion = async (productId: string) => {
    setAddingSuggestionId(productId);
    try {
      await addToCart(productId);
    } finally {
      setAddingSuggestionId(null);
    }
  };

  /* ── Redirect if not logged in ── */
  if (!isAuthenticated) {
    return (
      <section className="bg-neutral-900 px-4">
        <EmptyState
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-neutral-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          }
          title="Please log in"
          description="You need to be logged in to view your cart"
          actionLabel="Login"
          onAction={() => navigate('/login')}
        />
      </section>
    );
  }

  /* ── Loading ── */
  if (loading && cartItems.length === 0) {
    return (
      <section className="bg-neutral-900 min-h-[calc(100vh-4rem)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-100 mb-8">Your Local Cart</h1>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 rounded-xl bg-neutral-800/60 border border-neutral-800 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* ── Empty Cart ── */
  if (cartItems.length === 0) {
    return (
      <section className="bg-neutral-900 px-4">
        <EmptyState
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-neutral-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
              />
            </svg>
          }
          title="Your local shopping cart is empty"
          description="Explore products from nearby Jabalpur vendors."
          actionLabel="Shop Local Products"
          onAction={() => navigate('/products')}
        />
      </section>
    );
  }

  return (
    <section className="bg-neutral-900 min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8">
        {/* ── Page Title ── */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-100">
            Your Local <span className="text-gradient-gold">Shopping Cart</span>
          </h1>
          <p className="mt-2 text-sm text-neutral-400">
            Review products from trusted local shops before checkout.
          </p>
        </div>

        {/* ── Cart Items ── */}
        <div className="space-y-4 mb-8">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className={`flex flex-col sm:flex-row items-center gap-4 rounded-xl border border-neutral-800 bg-neutral-800/60 p-4 sm:p-5 transition-all duration-200 hover:border-neutral-700 hover:shadow-sm ${loading ? 'opacity-60 pointer-events-none' : ''}`}
            >
              {/* Image */}
              <Link to={`/product/${item.id}`} className="flex-shrink-0">
                <div className="h-20 w-20 rounded-xl bg-neutral-700 border border-neutral-600 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </Link>

              {/* Name + Price */}
              <div className="flex-1 min-w-0 text-center sm:text-left">
                <Link
                  to={`/product/${item.id}`}
                  className="text-sm font-semibold text-neutral-100 hover:text-primary-400 transition-colors duration-200 line-clamp-1"
                >
                  {item.name}
                </Link>
                <p className="text-sm text-primary-400 font-bold mt-1">
                  ₹{item.price.toFixed(2)}
                </p>
                <p className="text-[10px] text-neutral-500 mt-0.5">Sold by local vendor · Fast Jabalpur delivery</p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-0 rounded-xl border border-neutral-700 bg-neutral-900 overflow-hidden transition-all duration-200 w-full sm:w-auto">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1 || loading}
                  className="px-3 py-2 min-h-[44px] text-neutral-400 hover:text-primary-400 hover:bg-neutral-700 transition-all duration-200 text-sm font-bold disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  −
                </button>
                <span className="px-4 py-2 text-sm font-semibold text-neutral-100 min-w-[2.5rem] text-center border-x border-neutral-700 flex-1 sm:flex-none">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  disabled={loading}
                  className="px-3 py-2 min-h-[44px] text-neutral-400 hover:text-primary-400 hover:bg-neutral-700 transition-all duration-200 text-sm font-bold disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>

              {/* Line Total */}
              <p className="text-sm font-bold text-neutral-100 min-w-[5rem] text-center sm:text-right">
                ₹{(item.price * item.quantity).toFixed(2)}
              </p>

              {/* Remove Button */}
              <button
                onClick={() => removeFromCart(item.id)}
                disabled={loading}
                className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-neutral-600 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 disabled:opacity-30"
                aria-label={`Remove ${item.name}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* ── Total Section ── */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-800/60 p-4 sm:p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-semibold text-neutral-300">Total</span>
            <span className="text-2xl sm:text-3xl font-bold text-primary-400">
              ₹{totalPrice.toFixed(2)}
            </span>
          </div>

          {/* Local support note */}
          <div className="flex items-center justify-center gap-1.5 rounded-full bg-primary-500/10 border border-primary-500/15 px-3 py-1.5 mb-4">
            <span className="text-[11px] text-primary-300/80 font-medium">Every purchase supports local businesses in your city ❤️</span>
          </div>

          {/* Checkout Button */}
          <Link to="/checkout" className="block mb-4">
            <Button variant="secondary" size="lg" fullWidth disabled={loading}>
              Proceed to Secure Checkout
            </Button>
          </Link>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: '🔒', text: 'Secure Razorpay Payments' },
              { icon: '✅', text: 'Trusted Local Vendors' },
              { icon: '🚚', text: 'Fast City Delivery' },
              { icon: '🛡️', text: 'Safe Checkout' },
            ].map((b) => (
              <div key={b.text} className="flex items-center gap-1.5 text-[11px] text-neutral-500">
                <span>{b.icon}</span>
                <span>{b.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Continue Shopping */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-primary-400 transition-colors duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Continue Shopping
        </Link>
        {/* ══════════════════════════════════════
           FREQUENTLY BOUGHT TOGETHER
           ══════════════════════════════════════ */}
        {suggestionsLoading ? (
          <div className="mt-10 pt-8 border-t border-neutral-800">
            <h2 className="text-lg sm:text-xl font-bold text-neutral-100 mb-5">
              Frequently Bought Together
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-neutral-800 bg-neutral-800/50 overflow-hidden">
                  <div className="aspect-square bg-neutral-800 animate-pulse" />
                  <div className="p-3 space-y-2">
                    <div className="h-3 w-3/4 rounded bg-neutral-800 animate-pulse" />
                    <div className="h-4 w-1/2 rounded bg-neutral-800 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : suggestions.length > 0 ? (
          <div className="mt-10 pt-8 border-t border-neutral-800">
            <div className="flex items-center gap-2 mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              <h2 className="text-lg sm:text-xl font-bold text-neutral-100">
                Frequently Bought <span className="text-gradient-gold">Together</span>
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {suggestions.map((product) => {
                const img = product.images && product.images.length > 0 ? product.images[0] : '/products/headphones.png';
                const isAdding = addingSuggestionId === product._id;
                return (
                  <div
                    key={product._id}
                    className="group rounded-xl border border-neutral-800 bg-neutral-900/80 overflow-hidden transition-all duration-300 hover:border-primary-500/30 hover:shadow-gold"
                  >
                    <Link to={`/product/${product._id}`} className="block">
                      <div className="aspect-square bg-neutral-800/50 overflow-hidden">
                        <img
                          src={img}
                          alt={product.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    </Link>
                    <div className="p-2.5">
                      <Link to={`/product/${product._id}`}>
                        <h3 className="text-xs font-medium text-neutral-100 leading-snug line-clamp-1 hover:text-primary-400 transition-colors duration-200">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-xs font-semibold text-primary-400 mt-1">₹{product.price}</p>
                      <button
                        onClick={() => handleAddSuggestion(product._id)}
                        disabled={isAdding}
                        className={`mt-2 w-full py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-200 min-h-[32px] flex items-center justify-center gap-1 ${
                          isAdding
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-primary-500/10 text-primary-400 border border-primary-500/20 hover:bg-primary-500/20 hover:border-primary-500/30'
                        }`}
                      >
                        {isAdding ? (
                          <>
                            <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Adding...
                          </>
                        ) : (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Add
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default Cart;
