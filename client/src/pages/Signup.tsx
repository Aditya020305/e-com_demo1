import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';

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
const IconShieldPlus: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
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
   Signup Page
   ======================================== */
const Signup: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<ErrorState>({});
  const [touched, setTouched] = useState<TouchedState>({ name: false, email: false, password: false, confirmPassword: false });
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
      const validationErrors = validateForm(form);
      setErrors(validationErrors);
      if (Object.keys(validationErrors).length > 0) return;
      setIsLoading(true);
      try {
        await register(form.name, form.email, form.password);
        navigate('/');
      } catch (err: any) {
        const message =
          err?.response?.data?.message || 'Registration failed. Please try again.';
        setApiError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [form, register, navigate],
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
          <IconShieldPlus />
        </div>

        {/* Floating Feature Icons */}
        <div className="absolute inset-0 pointer-events-none hidden md:block">
          <div className="absolute top-[8%] left-[-12%] text-primary-400/50 drop-shadow-md animate-[float_4s_ease-in-out_infinite]">
            <IconClipboard />
          </div>
          <div className="absolute top-[5%] right-[-10%] text-primary-400/50 drop-shadow-md animate-[float_3.5s_ease-in-out_infinite_0.5s]">
            <IconGroup />
          </div>
          <div className="absolute top-[40%] left-[-18%] text-primary-400/50 drop-shadow-md animate-[float_4.5s_ease-in-out_infinite_1s]">
            <IconBank />
          </div>
          <div className="absolute top-[35%] right-[-16%] text-primary-400/50 drop-shadow-md animate-[float_3.8s_ease-in-out_infinite_0.3s]">
            <IconCard />
          </div>
          <div className="absolute bottom-[10%] left-[-10%] text-primary-400/50 drop-shadow-md animate-[float_5s_ease-in-out_infinite_0.8s]">
            <IconGear />
          </div>
          <div className="absolute bottom-[12%] right-[-8%] text-primary-400/50 drop-shadow-md animate-[float_4.2s_ease-in-out_infinite_1.2s]">
            <IconDocument />
          </div>
        </div>

        {/* ── Glass Card ── */}
        <div className="w-full rounded-xl border border-primary-500/15 bg-black/40 shadow-2xl shadow-black/40 backdrop-blur-xl p-8 sm:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-100">
              Create Account
            </h1>
            <p className="mt-2 text-neutral-500 text-sm">
              Join our marketplace in seconds
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {renderField('signup-name', 'name', 'text', 'John Doe', 'Full Name', userIcon)}
            {renderField('signup-email', 'email', 'email', 'you@example.com', 'Email Address', emailIcon)}
            {renderField('signup-password', 'password', 'password', '••••••••', 'Password', lockIcon)}
            {renderField('signup-confirm', 'confirmPassword', 'password', '••••••••', 'Confirm Password', lockIcon)}

            {/* Terms */}
            <label className="flex items-start gap-2 text-sm text-neutral-400 cursor-pointer select-none pt-1">
              <input type="checkbox" className="mt-0.5 h-3.5 w-3.5 rounded border-neutral-600 bg-neutral-800/50 text-primary-500 focus:ring-primary-500/30 transition-all duration-200" />
              <span className="text-xs">
                I agree to the{' '}
                <a href="#terms" className="text-primary-400 hover:text-primary-300 font-medium">Terms of Service</a>
                {' '}and{' '}
                <a href="#privacy" className="text-primary-400 hover:text-primary-300 font-medium">Privacy Policy</a>
              </span>
            </label>

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
                id="signup-submit"
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={isLoading}
                disabled={isDisabled}
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>
            </div>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-neutral-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary-400 hover:text-primary-300 transition-colors duration-200 underline underline-offset-2">
              Sign in
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

export default Signup;
