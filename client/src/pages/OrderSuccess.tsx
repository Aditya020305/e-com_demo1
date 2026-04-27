import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import type { OrderItem, ShippingAddress } from '../services/orderService';

/* ── Navigation State from Checkout ── */
interface OrderSuccessState {
  orderId: string;
  totalPrice: number;
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  createdAt: string;
}

/* ========================================
   Order Success Page — Backend-Integrated
   ======================================== */
const OrderSuccess: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as OrderSuccessState | null;

  /* ── No order data — redirect home ── */
  if (!state || !state.orderId) {
    return (
      <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-neutral-900 px-4">
        <div className="w-full max-w-md rounded-xl border border-neutral-800 bg-neutral-800/60 shadow-2xl shadow-black/30 p-8 sm:p-10 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-neutral-700/30 border border-neutral-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-neutral-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-neutral-100 mb-2">No order found</h1>
          <p className="text-neutral-500 mb-6 text-sm">
            It seems you landed here without placing an order.
          </p>
          <Link to="/">
            <Button variant="primary" size="lg" fullWidth>
              Go to Home
            </Button>
          </Link>
        </div>
      </section>
    );
  }

  const { orderId, totalPrice, orderItems, shippingAddress, paymentMethod, createdAt } = state;

  const formattedDate = new Date(createdAt).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-neutral-900 px-4 py-12">
      <div className="w-full max-w-lg">
        {/* ── Main Success Card ── */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-800/60 shadow-2xl shadow-black/30 p-8 sm:p-10 text-center mb-6">
          {/* ── Animated Success Icon ── */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 animate-bounce-once">
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
          <p className="text-neutral-400 mb-1">Thank you for your purchase</p>
          <p className="text-xs text-neutral-600 mb-6 font-mono">
            Order ID: {orderId}
          </p>

          {/* ── Total Amount ── */}
          <div className="rounded-xl bg-neutral-900/80 border border-neutral-700 px-6 py-4 mb-6">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">
              Total Amount
            </p>
            <p className="text-3xl font-bold text-primary-400">
              ₹{totalPrice.toFixed(2)}
            </p>
            <p className="text-xs text-neutral-600 mt-1">
              {paymentMethod} • {formattedDate}
            </p>
          </div>
        </div>

        {/* ── Order Items Summary ── */}
        {orderItems && orderItems.length > 0 && (
          <div className="rounded-xl border border-neutral-800 bg-neutral-800/60 p-4 sm:p-6 mb-6">
            <h2 className="text-sm font-bold text-neutral-300 uppercase tracking-wider mb-4">
              Items Ordered ({orderItems.length})
            </h2>
            <div className="space-y-3">
              {orderItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-3 py-2 px-2 -mx-2 rounded-lg hover:bg-neutral-700/20 transition-colors duration-200"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-neutral-200 font-medium truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-neutral-500">
                      Qty: {item.quantity} × ₹{item.price.toFixed(2)}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-neutral-300 flex-shrink-0">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Shipping Address Summary ── */}
        {shippingAddress && (
          <div className="rounded-xl border border-neutral-800 bg-neutral-800/60 p-4 sm:p-6 mb-6">
            <h2 className="text-sm font-bold text-neutral-300 uppercase tracking-wider mb-3">
              Shipping To
            </h2>
            <p className="text-sm text-neutral-400 leading-relaxed">
              {shippingAddress.address}
              <br />
              {shippingAddress.city}, {shippingAddress.postalCode}
              <br />
              {shippingAddress.country}
            </p>
          </div>
        )}

        {/* ── Action Buttons ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            variant="outline"
            size="lg"
            fullWidth
            onClick={() => navigate('/orders')}
          >
            View My Orders
          </Button>
          <Link to="/" className="block">
            <Button variant="secondary" size="lg" fullWidth>
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default OrderSuccess;
