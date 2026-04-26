import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../store/CartContext';
import Button from '../components/ui/Button';

/* ── Types ── */
interface FormState {
  fullName: string;
  email: string;
  address: string;
  city: string;
  zip: string;
}

/* ========================================
   Checkout Page
   ======================================== */
const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { cartItems, totalPrice, clearCart } = useCart();

  const [form, setForm] = useState<FormState>({
    fullName: '',
    email: '',
    address: '',
    city: '',
    zip: '',
  });

  const [errors, setErrors] = useState<Partial<FormState>>({});

  /* ── Handlers ── */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormState]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name as keyof FormState];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<FormState> = {};
    if (!form.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = 'Enter a valid email';
    if (!form.address.trim()) newErrors.address = 'Address is required';
    if (!form.city.trim()) newErrors.city = 'City is required';
    if (!form.zip.trim()) newErrors.zip = 'ZIP code is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const orderTotal = totalPrice;
    clearCart();
    navigate('/order-success', { state: { total: orderTotal } });
  };

  /* ── Empty Cart Guard ── */
  if (cartItems.length === 0) {
    return (
      <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-neutral-900 px-4">
        <div className="text-center max-w-md">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-neutral-800 border border-neutral-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-neutral-600"
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
          </div>
          <h1 className="text-2xl font-bold text-neutral-100 mb-2">
            Your cart is empty
          </h1>
          <p className="text-neutral-500 mb-8">
            Add items to your cart before checking out.
          </p>
          <Link to="/">
            <Button variant="primary" size="lg">
              Browse Products
            </Button>
          </Link>
        </div>
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
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-100 mb-8">Checkout</h1>

        <form onSubmit={handlePlaceOrder} noValidate>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ══════════════════════════════
               LEFT: User Details Form
               ══════════════════════════════ */}
            <div className="lg:col-span-2">
              <div className="rounded-xl border border-neutral-800 bg-neutral-800/60 p-4 sm:p-6">
                <h2 className="text-lg font-bold text-neutral-100 mb-6">
                  Shipping Details
                </h2>

                <div className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5"
                    >
                      Full Name
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      value={form.fullName}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className={inputClass('fullName')}
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-xs text-red-400">{errors.fullName}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className={inputClass('email')}
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-400">{errors.email}</p>
                    )}
                  </div>

                  {/* Address */}
                  <div>
                    <label
                      htmlFor="address"
                      className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5"
                    >
                      Address
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      rows={3}
                      value={form.address}
                      onChange={handleChange}
                      placeholder="123 Main Street, Apt 4B"
                      className={`${inputClass('address')} resize-none`}
                    />
                    {errors.address && (
                      <p className="mt-1 text-xs text-red-400">{errors.address}</p>
                    )}
                  </div>

                  {/* City + ZIP */}
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
                        placeholder="New York"
                        className={inputClass('city')}
                      />
                      {errors.city && (
                        <p className="mt-1 text-xs text-red-400">{errors.city}</p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="zip"
                        className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5"
                      >
                        ZIP Code
                      </label>
                      <input
                        id="zip"
                        name="zip"
                        type="text"
                        value={form.zip}
                        onChange={handleChange}
                        placeholder="10001"
                        className={inputClass('zip')}
                      />
                      {errors.zip && (
                        <p className="mt-1 text-xs text-red-400">{errors.zip}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ══════════════════════════════
               RIGHT: Order Summary
               ══════════════════════════════ */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-xl border border-neutral-800 bg-neutral-800/60 p-4 sm:p-6">
                <h2 className="text-lg font-bold text-neutral-100 mb-6">
                  Order Summary
                </h2>

                {/* Items list */}
                <div className="space-y-3 mb-6">
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

                {/* Place Order Button */}
                <Button
                  type="submit"
                  variant="secondary"
                  size="lg"
                  fullWidth
                >
                  Place Order
                </Button>

                {/* Secure note */}
                <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-neutral-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Secure SSL encrypted checkout
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
