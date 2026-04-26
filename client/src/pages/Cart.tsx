import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../store/CartContext';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';

/* ========================================
   Cart Page
   ======================================== */
const Cart: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, totalPrice } = useCart();
  const navigate = useNavigate();

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
          title="Your cart is empty"
          description="Looks like you haven't added anything yet"
          actionLabel="Continue Shopping"
          onAction={() => navigate('/')}
        />
      </section>
    );
  }

  return (
    <section className="bg-neutral-900 min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8">
        {/* ── Page Title ── */}
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-100 mb-8">Your Cart</h1>

        {/* ── Cart Items ── */}
        <div className="space-y-4 mb-8">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row items-center gap-4 rounded-xl border border-neutral-800 bg-neutral-800/60 p-4 sm:p-5 transition-all duration-200 hover:border-neutral-700 hover:shadow-sm"
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
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-0 rounded-xl border border-neutral-700 bg-neutral-900 overflow-hidden transition-all duration-200 w-full sm:w-auto">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  className="px-3 py-2 min-h-[44px] text-neutral-400 hover:text-primary-400 hover:bg-neutral-700 transition-all duration-200 text-sm font-bold disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  −
                </button>
                <span className="px-4 py-2 text-sm font-semibold text-neutral-100 min-w-[2.5rem] text-center border-x border-neutral-700 flex-1 sm:flex-none">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="px-3 py-2 min-h-[44px] text-neutral-400 hover:text-primary-400 hover:bg-neutral-700 transition-all duration-200 text-sm font-bold"
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
                className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-neutral-600 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
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
          <div className="flex items-center justify-between mb-6">
            <span className="text-lg font-semibold text-neutral-300">Total</span>
            <span className="text-2xl sm:text-3xl font-bold text-primary-400">
              ₹{totalPrice.toFixed(2)}
            </span>
          </div>

          {/* Checkout Button */}
          <Link to="/checkout" className="block">
            <Button variant="secondary" size="lg" fullWidth>
              Proceed to Checkout
            </Button>
          </Link>
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
      </div>
    </section>
  );
};

export default Cart;
