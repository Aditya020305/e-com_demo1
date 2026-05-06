import React, { useState, useCallback, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';

/* ── Types ── */
interface FormState {
  email: string;
  password: string;
}

interface ErrorState {
  email?: string;
  password?: string;
}

interface TouchedState {
  email: boolean;
  password: boolean;
}

/* ── Validation ── */
const validateEmail = (email: string): string | undefined => {
  if (!email.trim()) return 'Email is required';
  if (!email.includes('@')) return 'Please enter a valid email address';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email address';
  return undefined;
};

const validatePassword = (password: string): string | undefined => {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  return undefined;
};

const validateForm = (form: FormState): ErrorState => {
  const errors: ErrorState = {};
  const emailErr = validateEmail(form.email);
  const passErr = validatePassword(form.password);
  if (emailErr) errors.email = emailErr;
  if (passErr) errors.password = passErr;
  return errors;
};

/* ── Floating Icon Components ── */
const IconShieldLock: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
  </svg>
);

const IconClipboard: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l2 2 4-4" />
  </svg>
);

const IconGroup: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const IconBank: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const IconCard: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

const IconGear: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const IconDocument: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

/* ========================================
   Login Page
   ======================================== */
const Login: React.FC = () => {
  const { login, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  /** Detect vendor login intent from query param */
  const isVendorLogin = useMemo(
    () => searchParams.get('role') === 'vendor',
    [searchParams],
  );

  const [form, setForm] = useState<FormState>({ email: '', password: '' });
  const [errors, setErrors] = useState<ErrorState>({});
  const [touched, setTouched] = useState<TouchedState>({ email: false, password: false });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

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
        setErrors((prev) => {
          const next = { ...prev };
          delete next[name as keyof ErrorState];
          return next;
        });
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
      const validationErrors = validateForm(form);
      setErrors(validationErrors);
      if (Object.keys(validationErrors).length > 0) return;
      setIsLoading(true);
      try {
        const data = await login(form.email, form.password);

        /* ── Role-based validation & redirect ── */
        if (isVendorLogin && data.user.role !== 'vendor') {
          // Non-vendor tried the vendor login → deny access
          setApiError('Access denied: Not a vendor account');
          // Fully clear the auth state that was just saved
          logout();
          return;
        }

        // Redirect based on role
        if (data.user.role === 'vendor') {
          navigate('/vendor/dashboard');
        } else {
          navigate('/');
        }
      } catch (err: any) {
        const message =
          err?.response?.data?.message || 'Login failed. Please try again.';
        setApiError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [form, login, logout, navigate, isVendorLogin],
  );

  const inputBorder = (field: keyof ErrorState) =>
    showError(field)
      ? 'border-red-500/60 focus:border-red-400 focus:ring-red-400/30 focus:ring-offset-1 focus:ring-offset-transparent'
      : 'border-primary-500/20 focus:border-primary-400/60 focus:ring-primary-400/20 focus:ring-offset-1 focus:ring-offset-transparent';

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* ── Full-Screen Background ── */}
      <div className="absolute inset-0">
        <img src="/login-bg.png" alt="Background" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
      </div>

      {/* ── Main Content ── */}
      <div className="relative z-10 flex flex-col items-center px-4 py-12 w-full max-w-lg">
        {/* Top Lock Icon */}
        <div className="mb-6 text-primary-400 drop-shadow-lg animate-[float_3s_ease-in-out_infinite]">
          <IconShieldLock />
        </div>

        {/* Floating Feature Icons */}
        <div className="absolute inset-0 pointer-events-none hidden md:block">
          <div className="absolute top-[15%] left-[-12%] text-primary-400/50 drop-shadow-md animate-[float_4s_ease-in-out_infinite]">
            <IconClipboard />
          </div>
          <div className="absolute top-[12%] right-[-10%] text-primary-400/50 drop-shadow-md animate-[float_3.5s_ease-in-out_infinite_0.5s]">
            <IconGroup />
          </div>
          <div className="absolute top-[45%] left-[-18%] text-primary-400/50 drop-shadow-md animate-[float_4.5s_ease-in-out_infinite_1s]">
            <IconBank />
          </div>
          <div className="absolute top-[40%] right-[-16%] text-primary-400/50 drop-shadow-md animate-[float_3.8s_ease-in-out_infinite_0.3s]">
            <IconCard />
          </div>
          <div className="absolute bottom-[15%] left-[-10%] text-primary-400/50 drop-shadow-md animate-[float_5s_ease-in-out_infinite_0.8s]">
            <IconGear />
          </div>
          <div className="absolute bottom-[18%] right-[-8%] text-primary-400/50 drop-shadow-md animate-[float_4.2s_ease-in-out_infinite_1.2s]">
            <IconDocument />
          </div>
        </div>

        {/* ── Glass Card ── */}
        <div className="w-full rounded-xl border border-primary-500/15 bg-black/40 shadow-2xl shadow-black/40 backdrop-blur-xl p-8 sm:p-10">
          {/* Dynamic Login Heading */}
          <h1 className="text-2xl font-bold text-center text-neutral-100 mb-2">
            {isVendorLogin ? (
              <>
                <span className="text-gradient-gold">Vendor</span> Login
              </>
            ) : (
              <>
                Welcome Back to <span className="text-gradient-gold">JabalpurMart</span>
              </>
            )}
          </h1>
          <p className="text-center text-xs text-neutral-400 mb-6">
            {isVendorLogin
              ? 'Manage your local shop and grow your business online.'
              : 'Access products from trusted local vendors across Jabalpur.'}
          </p>
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Username / Email */}
            <div>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-primary-400/60">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Username"
                  aria-invalid={showError('email')}
                  aria-describedby={showError('email') ? 'email-error' : undefined}
                  className={`block w-full rounded-xl border bg-white/5 backdrop-blur-sm py-3.5 pl-12 pr-4 text-sm text-neutral-100 placeholder:text-neutral-500 shadow-inner shadow-black/20 transition-all duration-200 focus:ring-2 focus:outline-none ${inputBorder('email')}`}
                />
              </div>
              <div className={`overflow-hidden transition-all duration-200 ease-in-out ${showError('email') ? 'max-h-8 opacity-100 mt-1.5' : 'max-h-0 opacity-0'}`}>
                <p id="email-error" className="flex items-center gap-1 text-xs font-medium text-red-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {currentErrors.email}
                </p>
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-primary-400/60">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Password"
                  aria-invalid={showError('password')}
                  aria-describedby={showError('password') ? 'password-error' : undefined}
                  className={`block w-full rounded-xl border bg-white/5 backdrop-blur-sm py-3.5 pl-12 pr-12 text-sm text-neutral-100 placeholder:text-neutral-500 shadow-inner shadow-black/20 transition-all duration-200 focus:ring-2 focus:outline-none ${inputBorder('password')}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-neutral-500 hover:text-primary-400 transition-colors duration-200"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              <div className={`overflow-hidden transition-all duration-200 ease-in-out ${showError('password') ? 'max-h-8 opacity-100 mt-1.5' : 'max-h-0 opacity-0'}`}>
                <p id="password-error" className="flex items-center gap-1 text-xs font-medium text-red-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {currentErrors.password}
                </p>
              </div>
            </div>

            {/* Remember Me / Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer text-neutral-400 select-none group">
                <input type="checkbox" className="h-3.5 w-3.5 rounded border-neutral-600 bg-neutral-800 text-primary-500 focus:ring-primary-500/30 transition-all duration-200" />
                <span className="group-hover:text-primary-400 transition-colors duration-200 text-xs">Remember Me</span>
              </label>
              <a href="#forgot" className="text-xs text-neutral-400 hover:text-primary-400 transition-colors duration-200">
                Forgot Password?
              </a>
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

            {/* Login Button */}
            <div className="pt-1">
              <Button
                id="login-submit"
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={isLoading}
                disabled={isDisabled}
              >
                {isLoading ? 'Logging in...' : isVendorLogin ? 'Login as Vendor' : 'Sign In to JabalpurMart'}
              </Button>
            </div>
          </form>

          <p className="mt-6 text-center text-xs text-neutral-500">
            {isVendorLogin ? (
              <>
                Don't have a vendor account?{' '}
                <Link to="/vendor/register" className="font-semibold text-primary-400 hover:text-primary-300 transition-colors duration-200 underline underline-offset-2">
                  Register here
                </Link>
                <span className="mx-1.5 text-neutral-600">·</span>
                <Link to="/login" className="font-semibold text-neutral-400 hover:text-neutral-300 transition-colors duration-200 underline underline-offset-2">
                  User Login
                </Link>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <Link to="/signup" className="font-semibold text-primary-400 hover:text-primary-300 transition-colors duration-200 underline underline-offset-2">
                  Sign up
                </Link>
              </>
            )}
          </p>

          {/* ── Trust Indicators ── */}
          <div className="grid grid-cols-2 gap-2 mt-5">
            {[
              { icon: '🔒', text: 'Secure Login' },
              { icon: '✅', text: 'Trusted Marketplace' },
              { icon: '🏪', text: 'Verified Local Vendors' },
              { icon: '💳', text: 'Secure Payments' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-1.5 text-[11px] text-neutral-500">
                <span>{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
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

export default Login;
