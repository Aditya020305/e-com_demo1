import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../store/CartContext';
import { useAuth } from '../hooks/useAuth';
import { useWishlist } from '../context/WishlistContext';
import Button from './ui/Button';

/* ── Types ── */
export interface ProductData {
  id: number | string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  badge?: string;
}

interface ProductCardProps {
  product: ProductData;
}

/* ── Star Rating ── */
const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <svg
        key={star}
        xmlns="http://www.w3.org/2000/svg"
        className={`h-3.5 w-3.5 ${
          star <= Math.round(rating) ? 'text-primary-400' : 'text-neutral-700'
        }`}
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

/* ========================================
   ProductCard — Reusable Product Card
   ======================================== */
const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [addedFeedback, setAddedFeedback] = useState(false);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  const wishlisted = isInWishlist(String(product.id));

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : null;

  const handleAddToCart = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }
      await addToCart(String(product.id));
      setAddedFeedback(true);
      setTimeout(() => setAddedFeedback(false), 1200);
    },
    [addToCart, product, isAuthenticated, navigate],
  );

  const handleToggleWishlist = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      toggleWishlist({
        id: String(product.id),
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
      });
    },
    [toggleWishlist, product],
  );

  return (
    <div className="group relative flex flex-col w-full rounded-xl border border-neutral-800 bg-neutral-900/80 overflow-hidden shadow-sm transition-all duration-300 hover:border-primary-500/30 hover:shadow-gold hover:-translate-y-1">
      {/* ── Badges ── */}
      {product.badge && (
        <div
          className={`absolute top-3 left-3 z-10 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
            product.badge === 'Sale'
              ? 'bg-red-500/90 text-white'
              : product.badge === 'New'
              ? 'bg-emerald-500/90 text-white'
              : 'bg-primary-500/90 text-neutral-900'
          }`}
        >
          {product.badge}
        </div>
      )}

      {discount && (
        <div className="absolute top-3 right-3 z-10 px-2 py-1 rounded-lg bg-red-500/90 text-white text-[10px] font-bold">
          -{discount}%
        </div>
      )}

      {/* ── Image ── */}
      <Link
        to={`/product/${product.id}`}
        className="relative block aspect-[4/5] bg-neutral-800/50 overflow-hidden"
      >
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />
      </Link>

      {/* ── Quick Actions (appear on hover) ── */}
      <div className="absolute left-3 right-3 z-20 flex gap-2 transition-all duration-300 bottom-[calc(40%+0.5rem)] translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
        <Button
          variant="primary"
          size="sm"
          className="flex-1"
          onClick={handleAddToCart}
        >
          {addedFeedback ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Added!
            </>
          ) : (
            'Add to Cart'
          )}
        </Button>
        <button
          onClick={handleToggleWishlist}
          className={`flex items-center justify-center w-9 h-9 rounded-lg backdrop-blur-sm border transition-all duration-200 ${
            wishlisted
              ? 'bg-pink-500/20 text-pink-400 border-pink-500/30'
              : 'bg-neutral-800/80 text-neutral-300 hover:text-pink-400 border-neutral-700'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill={wishlisted ? 'currentColor' : 'none'}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </div>

      {/* ── Content ── */}
      <Link
        to={`/product/${product.id}`}
        className="flex flex-col flex-1 p-4 gap-1.5"
      >
        {/* Category */}
        <p className="text-[10px] font-medium text-primary-500/70 uppercase tracking-wider">
          {product.category}
        </p>

        {/* Name */}
        <h3 className="text-sm font-medium text-neutral-100 leading-snug line-clamp-1">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2 mt-0.5">
          <StarRating rating={product.rating} />
          <span className="text-[11px] text-neutral-500">
            ({product.reviews})
          </span>
        </div>

        {/* Price — pushed to bottom */}
        <div className="flex items-baseline gap-2 mt-auto pt-2">
          <span className="text-lg font-semibold text-primary-400">
            ₹{product.price}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-neutral-500 line-through">
              ₹{product.originalPrice}
            </span>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
