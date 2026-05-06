import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getMyOrders } from '../services/orderService';
import type { Order } from '../services/orderService';
// RAZORPAY INTEGRATION START
import { createRazorpayOrder, verifyRazorpayPayment } from '../services/orderService';
// RAZORPAY INTEGRATION END
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';

// RAZORPAY INTEGRATION START
declare global {
  interface Window {
    Razorpay: any;
  }
}
// RAZORPAY INTEGRATION END

/* ── Status Badge ── */
const StatusBadge: React.FC<{ delivered: boolean; paid: boolean }> = ({
  delivered,
  paid,
}) => {
  if (delivered) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        Delivered
      </span>
    );
  }
  if (paid) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
        Paid
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
      Processing
    </span>
  );
};

/* ========================================
   Orders History Page
   ======================================== */
const Orders: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading, user } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // RAZORPAY INTEGRATION START
  const [payingOrderId, setPayingOrderId] = useState<string | null>(null);
  // RAZORPAY INTEGRATION END

  /* ── Auth guard ── */
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [authLoading, isAuthenticated, navigate]);

  /* ── Fetch orders ── */
  useEffect(() => {
    if (!isAuthenticated) return;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getMyOrders();
        setOrders(response.data);
      } catch (err: any) {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          'Failed to load orders';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [isAuthenticated]);

  // RAZORPAY INTEGRATION START
  const handleRetryPayment = async (order: Order) => {
    setPayingOrderId(order._id);
    setError(null);
    try {
      const razorpayRes = await createRazorpayOrder(order._id);
      const { razorpayOrderId, keyId } = razorpayRes.data;

      const options = {
        key: keyId,
        amount: razorpayRes.data.amount,
        currency: razorpayRes.data.currency,
        name: 'E-Commerce Platform',
        description: `Order #${order._id.slice(-8)}`,
        order_id: razorpayOrderId,
        handler: async (response: any) => {
          try {
            await verifyRazorpayPayment({
              orderId: order._id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            // Refresh orders list to show updated status
            const refreshed = await getMyOrders();
            setOrders(refreshed.data);
          } catch (verifyErr: any) {
            setError(
              verifyErr?.response?.data?.message ||
              'Payment verification failed. Contact support.'
            );
          } finally {
            setPayingOrderId(null);
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
        },
        theme: {
          color: '#4F46E5',
        },
        modal: {
          ondismiss: () => {
            setPayingOrderId(null);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to initiate payment. Please try again.'
      );
      setPayingOrderId(null);
    }
  };
  // RAZORPAY INTEGRATION END

  /* ── Auth loading ── */
  if (authLoading) {
    return (
      <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-neutral-900">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-neutral-700 border-t-primary-400" />
      </section>
    );
  }

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <section className="bg-neutral-900 min-h-[calc(100vh-4rem)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-100 mb-8">
            Your Local Orders
          </h1>
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-32 rounded-xl bg-neutral-800/60 border border-neutral-800 animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* ── Error state ── */
  if (error) {
    return (
      <section className="bg-neutral-900 min-h-[calc(100vh-4rem)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-100 mb-8">
            Your Local Orders
          </h1>
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-6 py-8 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-red-400 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <p className="text-red-400 font-semibold mb-2">
              Failed to load orders
            </p>
            <p className="text-sm text-red-300/70 mb-4">{error}</p>
            <Button
              variant="outline"
              size="md"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        </div>
      </section>
    );
  }

  /* ── Empty orders ── */
  if (orders.length === 0) {
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          }
          title="You haven't placed any local orders yet"
          description="Explore products from nearby Jabalpur vendors and place your first order."
          actionLabel="Shop Local Products"
          onAction={() => navigate('/products')}
        />
      </section>
    );
  }

  /* ── Orders list ── */
  return (
    <section className="bg-neutral-900 min-h-[calc(100vh-4rem)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-8">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-100">
              Your Local <span className="text-gradient-gold">Orders</span>
            </h1>
            <span className="text-sm text-neutral-500 bg-neutral-800 px-3 py-1.5 rounded-full border border-neutral-700">
              {orders.length} order{orders.length !== 1 ? 's' : ''}
            </span>
          </div>
          <p className="text-sm text-neutral-400">
            Track purchases from trusted local shops across the city.
          </p>
        </div>

        {/* Community Message */}
        <div className="flex items-center justify-center gap-1.5 rounded-full bg-primary-500/10 border border-primary-500/15 px-3 py-1.5 mb-6">
          <span className="text-[11px] text-primary-300/80 font-medium">Thank you for supporting local businesses in Jabalpur ❤️</span>
        </div>

        {/* ── Orders ── */}
        <div className="space-y-4">
          {orders.map((order) => {
            const date = new Date(order.createdAt).toLocaleDateString(
              'en-IN',
              {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              },
            );

            return (
              <div
                key={order._id}
                className="group rounded-xl border border-neutral-800 bg-neutral-800/60 p-4 sm:p-6 transition-all duration-200 hover:border-neutral-700 hover:shadow-lg hover:shadow-black/20"
              >
                {/* ── Header Row ── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div className="min-w-0">
                    <p className="text-xs text-neutral-600 font-mono truncate">
                      {order._id}
                    </p>
                    <p className="text-xs text-neutral-500 mt-0.5">{date}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <StatusBadge
                      delivered={order.isDelivered}
                      paid={order.isPaid}
                    />
                  </div>
                </div>

                {/* ── Items Preview ── */}
                <div className="space-y-2 mb-4">
                  {order.orderItems.slice(0, 3).map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-3 text-sm"
                    >
                      <span className="text-neutral-300 truncate min-w-0 flex-1">
                        {item.name}
                        <span className="text-neutral-600 ml-1">
                          × {item.quantity}
                        </span>
                      </span>
                      <span className="text-neutral-400 flex-shrink-0 font-medium">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  {order.orderItems.length > 3 && (
                    <p className="text-xs text-neutral-600">
                      + {order.orderItems.length - 3} more item
                      {order.orderItems.length - 3 !== 1 ? 's' : ''}
                    </p>
                  )}
                  <p className="text-[10px] text-neutral-500 mt-1">From trusted Jabalpur sellers</p>
                </div>

                {/* ── Footer Row ── */}
                <div className="flex items-center justify-between pt-3 border-t border-neutral-700/50">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-neutral-500">
                      {order.paymentMethod}
                    </span>
                    <span className="text-neutral-700">•</span>
                    <span className="text-xs text-neutral-500">
                      {order.shippingAddress.city},{' '}
                      {order.shippingAddress.country}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    {/* RAZORPAY INTEGRATION START */}
                    {order.paymentMethod !== 'COD' && !order.isPaid && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleRetryPayment(order)}
                        loading={payingOrderId === order._id}
                        disabled={payingOrderId === order._id}
                      >
                        Pay Now
                      </Button>
                    )}
                    {/* RAZORPAY INTEGRATION END */}
                    <span className="text-lg font-bold text-primary-400">
                      ₹{order.totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Trust Indicators ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-8 mb-6">
          {[
            { icon: '🔒', text: 'Secure Payments' },
            { icon: '🏪', text: 'Local Vendor Network' },
            { icon: '🚚', text: 'Fast City Delivery' },
            { icon: '💬', text: 'Customer Support' },
          ].map((b) => (
            <div key={b.text} className="flex items-center gap-1.5 text-[11px] text-neutral-500">
              <span>{b.icon}</span>
              <span>{b.text}</span>
            </div>
          ))}
        </div>

        {/* ── Continue Shopping Link ── */}
        <div className="text-center">
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
            Continue Shopping Locally
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Orders;
