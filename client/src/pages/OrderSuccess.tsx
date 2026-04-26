import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from '../components/ui/Button';

/* ========================================
   Order Success Page
   ======================================== */
const OrderSuccess: React.FC = () => {
  const location = useLocation();
  const state = location.state as { total?: number } | null;
  const total = state?.total;
  const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

  return (
    <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-neutral-900 px-4">
      <div className="w-full max-w-md rounded-xl border border-neutral-800 bg-neutral-800/60 shadow-2xl shadow-black/30 p-8 sm:p-10 text-center">
        {/* ── Success Icon ── */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-emerald-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* ── Title ── */}
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-100 mb-2">
          Order Placed Successfully!
        </h1>

        {/* ── Subtitle ── */}
        <p className="text-neutral-400 mb-1">Thank you for your purchase</p>
        <p className="text-sm text-neutral-500 mb-6">Order #{orderId}</p>

        {/* ── Total Amount ── */}
        {total !== undefined && (
          <div className="rounded-xl bg-neutral-900/80 border border-neutral-700 px-6 py-4 mb-8">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">
              Amount Paid
            </p>
            <p className="text-3xl font-bold text-primary-400">
              ₹{total.toFixed(2)}
            </p>
          </div>
        )}

        {/* ── Continue Shopping Button ── */}
        <Link to="/">
          <Button variant="secondary" size="lg" fullWidth>
            Continue Shopping
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default OrderSuccess;
