import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../../services/authService';
import Button from '../../components/ui/Button';

/* ── Types ── */
interface FormState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface ErrorState {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

interface TouchedState {
  name: boolean;
  email: boolean;
  password: boolean;
  confirmPassword: boolean;
}

/* ── Validation ── */
const validateForm = (form: FormState): ErrorState => {
  const errors: ErrorState = {};
  if (!form.name.trim()) errors.name = 'Full name is required';
  if (!form.email.trim()) errors.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Please enter a valid email';
  if (!form.password) errors.password = 'Password is required';
  else if (form.password.length < 6) errors.password = 'Password must be at least 6 characters';
  if (!form.confirmPassword) errors.confirmPassword = 'Please confirm your password';
  else if (form.password !== form.confirmPassword) errors.confirmPassword = 'Passwords do not match';
  return errors;
};

/* ── Floating Icon Components ── */
const IconStorefront: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
  </svg>
);

const IconChart: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const IconTruck: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
  </svg>
);

const IconCube: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const IconTag: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
  </svg>
);

const IconWallet: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

/* ========================================
   VendorRegister — Vendor Registration Page
   ======================================== */
const VendorRegister: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<ErrorState>({});
  const [touched, setTouched] = useState<TouchedState>({ name: false, email: false, password: false, confirmPassword: false });
  const [isLoading, setIsLoading] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const currentErrors = validateForm(form);
  const hasErrors = Object.keys(currentErrors).length > 0;
  const isDisabled = hasErrors || isLoading;

  const showError = (field: keyof ErrorState): boolean =>
    !!(currentErrors[field] && (touched[field] || submitAttempted));

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
      if (errors[name as keyof ErrorState]) {
        setErrors((prev) => { const n = { ...prev }; delete n[name as keyof ErrorState]; return n; });
      }
    },
    [errors],
  );

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitAttempted(true);
      setApiError(null);
      setSuccessMessage(null);

      const validationErrors = validateForm(form);
      setErrors(validationErrors);
      if (Object.keys(validationErrors).length > 0) return;

      setIsLoading(true);
      try {
        // Register with role "vendor" — DO NOT auto-login
        await registerUser(form.name, form.email, form.password, 'vendor');

        // Show success, then redirect to vendor login
        setSuccessMessage('Account created! Redirecting to login...');
        setTimeout(() => {
          navigate('/login?role=vendor');
        }, 1500);
      } catch (err: any) {
        const message =
          err?.response?.data?.message || 'Registration failed. Please try again.';
        setApiError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [form, navigate],
  );

  const inputBorder = (field: keyof ErrorState) =>
    showError(field)
      ? 'border-red-500/60 focus:border-red-400 focus:ring-red-400/30 focus:ring-offset-1 focus:ring-offset-transparent'
      : 'border-primary-500/20 focus:border-primary-400/60 focus:ring-primary-400/20 focus:ring-offset-1 focus:ring-offset-transparent';

  /* ── Reusable field renderer ── */
  const renderField = (
    id: string,
    name: keyof FormState,
    type: string,
    placeholder: string,
    label: string,
    icon: React.ReactNode,
  ) => (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold text-neutral-400 uppercase tracking-wider">
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-primary-400/60">
          {icon}
        </span>
        <input
          id={id}
          name={name}
          type={type}
          value={form[name]}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          aria-invalid={showError(name)}
          className={`block w-full rounded-xl border bg-white/5 backdrop-blur-sm py-3.5 pl-12 pr-4 text-sm text-neutral-100 placeholder:text-neutral-500 shadow-inner shadow-black/20 transition-all duration-200 focus:ring-2 focus:outline-none ${inputBorder(name)}`}
        />
      </div>
      <div className={`overflow-hidden transition-all duration-200 ease-in-out ${showError(name) ? 'max-h-8 opacity-100 mt-1.5' : 'max-h-0 opacity-0'}`}>
        <p className="flex items-center gap-1 text-xs font-medium text-red-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {currentErrors[name]}
        </p>
      </div>
    </div>
  );

  /* Icons */
  const userIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
  const emailIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
  const lockIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* ── Full-Screen Background ── */}
      <div className="absolute inset-0">
        <img src="/login-bg.png" alt="Background" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
      </div>

      {/* ── Main Content ── */}
      <div className="relative z-10 flex flex-col items-center px-4 py-12 w-full max-w-lg">
        {/* Top Icon */}
        <div className="mb-6 text-primary-400 drop-shadow-lg animate-[float_3s_ease-in-out_infinite]">
          <IconStorefront />
        </div>

        {/* Floating Feature Icons */}
        <div className="absolute inset-0 pointer-events-none hidden md:block">
          <div className="absolute top-[8%] left-[-12%] text-primary-400/50 drop-shadow-md animate-[float_4s_ease-in-out_infinite]">
            <IconChart />
          </div>
          <div className="absolute top-[5%] right-[-10%] text-primary-400/50 drop-shadow-md animate-[float_3.5s_ease-in-out_infinite_0.5s]">
            <IconTruck />
          </div>
          <div className="absolute top-[40%] left-[-18%] text-primary-400/50 drop-shadow-md animate-[float_4.5s_ease-in-out_infinite_1s]">
            <IconCube />
          </div>
          <div className="absolute top-[35%] right-[-16%] text-primary-400/50 drop-shadow-md animate-[float_3.8s_ease-in-out_infinite_0.3s]">
            <IconTag />
          </div>
          <div className="absolute bottom-[10%] left-[-10%] text-primary-400/50 drop-shadow-md animate-[float_5s_ease-in-out_infinite_0.8s]">
            <IconWallet />
          </div>
        </div>

        {/* ── Glass Card ── */}
        <div className="w-full rounded-xl border border-primary-500/15 bg-black/40 shadow-2xl shadow-black/40 backdrop-blur-xl p-8 sm:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-100">
              <span className="text-gradient-gold">Vendor</span> Registration
            </h1>
            <p className="mt-2 text-neutral-500 text-sm">
              Create your vendor account and start selling
            </p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {successMessage}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {renderField('vendor-reg-name', 'name', 'text', 'Your full name', 'Full Name', userIcon)}
            {renderField('vendor-reg-email', 'email', 'email', 'vendor@example.com', 'Email Address', emailIcon)}
            {renderField('vendor-reg-password', 'password', 'password', '••••••••', 'Password', lockIcon)}
            {renderField('vendor-reg-confirm', 'confirmPassword', 'password', '••••••••', 'Confirm Password', lockIcon)}

            {/* Vendor Notice */}
            <div className="flex items-start gap-2.5 rounded-lg border border-primary-500/15 bg-primary-500/5 px-4 py-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-400 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                By registering as a vendor, you'll get access to product management, order tracking, and analytics dashboards.
              </p>
            </div>

            {/* API Error */}
            {apiError && (
              <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {apiError}
              </div>
            )}

            {/* Submit */}
            <div className="pt-1">
              <Button
                id="vendor-register-submit"
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={isLoading}
                disabled={isDisabled || !!successMessage}
              >
                {isLoading ? 'Creating vendor account...' : 'Create Vendor Account'}
              </Button>
            </div>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-neutral-500">
            Already have an account?{' '}
            <Link to="/login?role=vendor" className="font-semibold text-primary-400 hover:text-primary-300 transition-colors duration-200 underline underline-offset-2">
              Vendor Login
            </Link>
          </p>
        </div>
      </div>

      {/* Float keyframe */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
      `}</style>
    </section>
  );
};

export default VendorRegister;
