import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import EmptyState from '../components/ui/EmptyState';

/* ========================================
   Wishlist Page
   ======================================== */
const Wishlist: React.FC = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();

  /* ── Empty Wishlist ── */
  if (wishlistItems.length === 0) {
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
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          }
          title="Your wishlist is empty"
          description="Save items you love by tapping the heart icon"
          actionLabel="Browse Products"
          onAction={() => navigate('/products')}
        />
      </section>
    );
  }

  return (
    <section className="bg-neutral-900 min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8">
        {/* ── Page Title ── */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-100">
            My <span className="text-gradient-gold">Wishlist</span>
          </h1>
          <span className="text-sm text-neutral-500">
            {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* ── Wishlist Items ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <div
              key={item.id}
              className="group relative flex flex-col rounded-xl border border-neutral-800 bg-neutral-900/80 overflow-hidden transition-all duration-300 hover:border-primary-500/30 hover:shadow-gold"
            >
              {/* Remove Button */}
              <button
                onClick={() => removeFromWishlist(item.id)}
                className="absolute top-3 right-3 z-10 p-2 rounded-lg bg-neutral-900/80 backdrop-blur-sm border border-neutral-700 text-red-400 hover:bg-red-500/20 hover:border-red-500/30 transition-all duration-200"
                aria-label={`Remove ${item.name} from wishlist`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {/* Image */}
              <Link to={`/product/${item.id}`} className="block aspect-[4/5] bg-neutral-800/50 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </Link>

              {/* Content */}
              <div className="p-4 flex flex-col gap-1.5">
                <p className="text-[10px] font-medium text-primary-500/70 uppercase tracking-wider">
                  {item.category}
                </p>
                <Link
                  to={`/product/${item.id}`}
                  className="text-sm font-medium text-neutral-100 leading-snug line-clamp-1 hover:text-primary-400 transition-colors duration-200"
                >
                  {item.name}
                </Link>
                <span className="text-lg font-semibold text-primary-400 mt-auto pt-1">
                  ₹{item.price}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Continue Shopping */}
        <div className="mt-8">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-primary-400 transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Continue Shopping
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Wishlist;
