import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../store/CartContext';
import { useAuth } from '../hooks/useAuth';
import { createOrder } from '../services/orderService';
import { createRazorpayOrder, verifyRazorpayPayment } from '../services/orderService'; // RAZORPAY INTEGRATION
import type { ShippingAddress } from '../services/orderService';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';

// RAZORPAY INTEGRATION START
declare global {
  interface Window {
    Razorpay: any;
  }
}
// RAZORPAY INTEGRATION END

/* ── Types ── */
interface FormState {
  address: string;
  city: string;
  postalCode: string;
  country: string;
  paymentMethod: string;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

const PAYMENT_METHODS = [
  { value: 'COD', label: 'Cash on Delivery', icon: '💵' },
  { value: 'UPI', label: 'UPI', icon: '📱' },
  { value: 'Card', label: 'Credit / Debit Card', icon: '💳' },
  { value: 'NetBanking', label: 'Net Banking', icon: '🏦' },
];

/* ========================================
   Checkout Page — Backend-Integrated
   ======================================== */
const Checkout: React.FC = () => {
  const navigate = useNavigate();
  // RAZORPAY INTEGRATION: extract user for prefill
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const { cartItems, totalPrice, loading: cartLoading, clearCart, fetchCart } = useCart();

  const [form, setForm] = useState<FormState>({
    address: '',
    city: '',
    postalCode: '',
    country: 'India',
    paymentMethod: 'COD',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  /* ── Auth guard ── */
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [authLoading, isAuthenticated, navigate]);

  /* ── Ensure cart is loaded ── */
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart]);

  /* ── Handlers ── */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setApiError(null);
    if (errors[name as keyof FormState]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name as keyof FormState];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.address.trim()) newErrors.address = 'Address is required';
    if (!form.city.trim()) newErrors.city = 'City is required';
    if (!form.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
    if (!form.country.trim()) newErrors.country = 'Country is required';
    if (!form.paymentMethod) newErrors.paymentMethod = 'Select a payment method';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setApiError(null);

    try {
      const shippingAddress: ShippingAddress = {
        address: form.address.trim(),
        city: form.city.trim(),
        postalCode: form.postalCode.trim(),
        country: form.country.trim(),
      };

      const response = await createOrder({
        shippingAddress,
        paymentMethod: form.paymentMethod,
      });

      // RAZORPAY INTEGRATION START
      // For any online payment method (non-COD), open Razorpay checkout
      if (form.paymentMethod !== 'COD') {
        await handleRazorpayPayment(response.data._id, response.data.totalPrice, response.data);
        return; // handleRazorpayPayment manages navigation
      }
      // RAZORPAY INTEGRATION END

      // Clear local cart state (backend already emptied the cart)
      clearCart();

      // Redirect with real order data
      navigate('/order-success', {
        state: {
          orderId: response.data._id,
          totalPrice: response.data.totalPrice,
          orderItems: response.data.orderItems,
          shippingAddress: response.data.shippingAddress,
          paymentMethod: response.data.paymentMethod,
          createdAt: response.data.createdAt,
        },
        replace: true,
      });
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Order failed. Please try again.';
      setApiError(message);
    } finally {
      setSubmitting(false);
    }
  };

  // RAZORPAY INTEGRATION START
  const handleRazorpayPayment = async (orderId: string, amount: number, orderData: any) => {
    try {
      // Step 1: Create Razorpay order on backend
      const razorpayRes = await createRazorpayOrder(orderId);
      const { razorpayOrderId, keyId } = razorpayRes.data;

      // Step 2: Open Razorpay checkout modal
      const options = {
        key: keyId,
        amount: razorpayRes.data.amount,
        currency: razorpayRes.data.currency,
        name: 'JabalpurMart',
        description: `Order #${orderId.slice(-8)}`,
        order_id: razorpayOrderId,
        handler: async (response: any) => {
          try {
            // Step 3: Verify payment on backend
            await verifyRazorpayPayment({
              orderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            // Step 4: Clear cart and navigate to success
            clearCart();
            navigate('/order-success', {
              state: {
                orderId: orderData._id,
                totalPrice: orderData.totalPrice,
                orderItems: orderData.orderItems,
                shippingAddress: orderData.shippingAddress,
                paymentMethod: orderData.paymentMethod,
                createdAt: orderData.createdAt,
                isPaid: true, // Payment verified
              },
              replace: true,
            });
          } catch (verifyErr: any) {
            setApiError(
              verifyErr?.response?.data?.message ||
              'Payment verification failed. Contact support.'
            );
            setSubmitting(false);
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
            setApiError('Payment was cancelled. Your order is saved — you can retry payment from Orders page.');
            setSubmitting(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to initiate payment. Please try again.';
      setApiError(message);
      setSubmitting(false);
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

  /* ── Cart loading ── */
  if (cartLoading && cartItems.length === 0) {
    return (
      <section className="bg-neutral-900 min-h-[calc(100vh-4rem)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-100 mb-8">Secure Checkout</h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-16 rounded-xl bg-neutral-800/60 border border-neutral-800 animate-pulse" />
              ))}
            </div>
            <div className="h-72 rounded-xl bg-neutral-800/60 border border-neutral-800 animate-pulse" />
          </div>
        </div>
      </section>
    );
  }

  /* ── Empty Cart Guard ── */
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
          description="Explore products from nearby vendors in Jabalpur."
          actionLabel="Browse Local Products"
          onAction={() => navigate('/')}
        />
      </section>
    );
  }

  /* ── Input helper ── */
  const inputClass = (field: keyof FormState) =>
    `w-full rounded-xl border bg-neutral-800 px-4 py-3 text-sm text-neutral-100 placeholder:text-neutral-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-neutral-900 min-h-[44px] ${
      errors[field]
        ? 'border-red-500/60 focus:ring-red-400/30'
        : 'border-neutral-700 focus:border-primary-400/60 focus:ring-primary-400/20'
    }`;

  return (
    <section className="bg-neutral-900 min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8">
        {/* ── Page Title ── */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-100">
            Secure Checkout for <span className="text-gradient-gold">Local Orders</span>
          </h1>
          <p className="mt-2 text-sm text-neutral-400">
            Ordering from trusted vendors across Jabalpur.
          </p>
        </div>

        {/* ── Trust Badges ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { icon: '🔒', text: 'Secure Razorpay Payments', accent: 'border-emerald-500/20 bg-emerald-500/5' },
            { icon: '✅', text: 'Trusted Local Vendors', accent: 'border-primary-500/20 bg-primary-500/5' },
            { icon: '🚚', text: 'Fast Jabalpur Delivery', accent: 'border-blue-500/20 bg-blue-500/5' },
            { icon: '💬', text: 'Local Customer Support', accent: 'border-purple-500/20 bg-purple-500/5' },
          ].map((badge) => (
            <div
              key={badge.text}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-xs text-neutral-300 transition-all duration-200 hover:scale-[1.02] ${badge.accent}`}
            >
              <span className="text-base flex-shrink-0">{badge.icon}</span>
              <span className="font-medium leading-tight">{badge.text}</span>
            </div>
          ))}
        </div>

        {/* ── API Error Banner ── */}
        {apiError && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4 flex items-start gap-3 animate-in fade-in duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="text-sm font-semibold text-red-400">Order Failed</p>
              <p className="text-sm text-red-300/80 mt-0.5">{apiError}</p>
            </div>
          </div>
        )}

        <form onSubmit={handlePlaceOrder} noValidate>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ══════════════════════════════
               LEFT: Shipping + Payment Form
               ══════════════════════════════ */}
            <div className="lg:col-span-2 space-y-6">
              {/* ── Shipping Details Card ── */}
              <div className="rounded-xl border border-neutral-800 bg-neutral-800/60 p-4 sm:p-6">
                <h2 className="text-lg font-bold text-neutral-100 mb-2 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  Delivery Location
                </h2>
                <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 mb-6 ml-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs text-emerald-300/80 font-medium">Most orders are delivered quickly within Jabalpur city limits.</span>
                </div>

                <div className="space-y-4">
                  {/* Address */}
                  <div>
                    <label
                      htmlFor="address"
                      className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5"
                    >
                      Street Address
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      rows={3}
                      value={form.address}
                      onChange={handleChange}
                      placeholder="123 Main Street, Apt 4B"
                      disabled={submitting}
                      className={`${inputClass('address')} resize-none`}
                    />
                    {errors.address && (
                      <p className="mt-1 text-xs text-red-400">{errors.address}</p>
                    )}
                  </div>

                  {/* City + Postal Code */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="city"
                        className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5"
                      >
                        City
                      </label>
                      <input
                        id="city"
                        name="city"
                        type="text"
                        value={form.city}
                        onChange={handleChange}
                        placeholder="Jabalpur"
                        disabled={submitting}
                        className={inputClass('city')}
                      />
                      {errors.city && (
                        <p className="mt-1 text-xs text-red-400">{errors.city}</p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="postalCode"
                        className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5"
                      >
                        Postal Code
                      </label>
                      <input
                        id="postalCode"
                        name="postalCode"
                        type="text"
                        value={form.postalCode}
                        onChange={handleChange}
                        placeholder="400001"
                        disabled={submitting}
                        className={inputClass('postalCode')}
                      />
                      {errors.postalCode && (
                        <p className="mt-1 text-xs text-red-400">{errors.postalCode}</p>
                      )}
                    </div>
                  </div>

                  {/* Country */}
                  <div>
                    <label
                      htmlFor="country"
                      className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5"
                    >
                      Country
                    </label>
                    <input
                      id="country"
                      name="country"
                      type="text"
                      value={form.country}
                      onChange={handleChange}
                      placeholder="India"
                      disabled={submitting}
                      className={inputClass('country')}
                    />
                    {errors.country && (
                      <p className="mt-1 text-xs text-red-400">{errors.country}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* ── Payment Method Card ── */}
              <div className="rounded-xl border border-neutral-800 bg-neutral-800/60 p-4 sm:p-6">
                <h2 className="text-lg font-bold text-neutral-100 mb-6 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                  </svg>
                  Payment Method
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PAYMENT_METHODS.map((method) => (
                    <label
                      key={method.value}
                      className={`relative flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition-all duration-200 ${
                        form.paymentMethod === method.value
                          ? 'border-primary-400/60 bg-primary-400/5 ring-1 ring-primary-400/20'
                          : 'border-neutral-700 bg-neutral-800/40 hover:border-neutral-600 hover:bg-neutral-800/70'
                      } ${submitting ? 'opacity-60 pointer-events-none' : ''}`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.value}
                        checked={form.paymentMethod === method.value}
                        onChange={handleChange}
                        disabled={submitting}
                        className="sr-only"
                      />
                      <span className="text-xl flex-shrink-0">{method.icon}</span>
                      <span className="text-sm font-medium text-neutral-200">{method.label}</span>
                      {form.paymentMethod === method.value && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-primary-400 ml-auto flex-shrink-0"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </label>
                  ))}
                </div>
                {errors.paymentMethod && (
                  <p className="mt-2 text-xs text-red-400">{errors.paymentMethod}</p>
                )}

                {/* Secure payment note */}
                <div className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs text-emerald-300/80 font-medium">Payments secured via Razorpay</span>
                </div>
              </div>
            </div>

            {/* ══════════════════════════════
               RIGHT: Order Summary
               ══════════════════════════════ */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-xl border border-neutral-800 bg-neutral-800/60 p-4 sm:p-6">
                <h2 className="text-lg font-bold text-neutral-100 mb-6 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                  </svg>
                  Order Summary
                </h2>

                {/* Items list */}
                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-neutral-700">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-3 py-1.5 px-1 -mx-1 rounded-lg transition-colors duration-200 hover:bg-neutral-700/30"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-10 w-10 rounded-lg bg-neutral-700 border border-neutral-600 overflow-hidden flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm text-neutral-200 font-medium truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-neutral-500">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-neutral-300 flex-shrink-0">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Divider */}
                <div className="border-t border-neutral-700 pt-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-neutral-100">
                      Total
                    </span>
                    <span className="text-xl sm:text-2xl font-bold text-primary-400">
                      ₹{totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Local support note */}
                <div className="flex items-center justify-center gap-1.5 rounded-full bg-primary-500/10 border border-primary-500/15 px-3 py-1.5 mb-4">
                  <span className="text-[11px] text-primary-300/80 font-medium">Supporting local businesses with every purchase ❤️</span>
                </div>

                {/* Place Order Button */}
                <Button
                  type="submit"
                  variant="secondary"
                  size="lg"
                  fullWidth
                  loading={submitting}
                  disabled={submitting}
                >
                  {submitting ? 'Placing Order…' : 'Confirm Local Order'}
                </Button>

                {/* Secure note */}
                <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-neutral-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 text-emerald-500/60"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Secure checkout powered by Razorpay
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Checkout;
