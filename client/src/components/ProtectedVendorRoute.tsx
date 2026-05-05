import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/* ========================================
   ProtectedVendorRoute
   Guards vendor-only routes.
   - No user → redirect to /login
   - Role !== "vendor" → redirect to /
   - Else → render children
   ======================================== */
const ProtectedVendorRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, user, loading } = useAuth();

  /* Wait for auth state to hydrate from localStorage */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-900">
        <div className="flex flex-col items-center gap-3">
          <svg
            className="animate-spin h-8 w-8 text-primary-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <p className="text-sm text-neutral-500">Loading...</p>
        </div>
      </div>
    );
  }

  /* Not authenticated → send to login */
  if (!isAuthenticated || !user) {
    return <Navigate to="/login?role=vendor" replace />;
  }

  /* Not a vendor → send to homepage */
  if (user.role !== 'vendor') {
    return <Navigate to="/" replace />;
  }

  /* Authorized vendor → render page */
  return <>{children}</>;
};

export default ProtectedVendorRoute;
