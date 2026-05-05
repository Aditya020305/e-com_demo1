import React, { useState, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../store/CartContext';
import { useWishlist } from '../context/WishlistContext';

const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { totalItems } = useCart();
  const { wishlistCount } = useWishlist();

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  /** Highlight the active route link */
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = useCallback(() => {
    logout();
    closeMobile();
    navigate('/');
  }, [logout, closeMobile, navigate]);

  // Hide the entire customer navbar on vendor routes
  const isVendorRoute = location.pathname.startsWith('/vendor');
  if (isVendorRoute) return null;

  /* ── Links for guests ── */
  const guestLinks = [
    { to: '/', label: 'Home' },
    { to: '/login', label: 'Sign In' },
    { to: '/signup', label: 'Sign Up' },
    { to: '/login?role=vendor', label: 'Vendor Login' },
  ];

  /* ── Links for authenticated users ── */
  const authLinks = [
    { to: '/', label: 'Home' },
    { to: '/wishlist', label: 'Wishlist' },
    { to: '/cart', label: 'Cart' },
    { to: '/orders', label: 'Orders' },
  ];

  const navLinks = isAuthenticated ? authLinks : guestLinks;

  return (
    <nav className="bg-neutral-950/90 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex items-center justify-between h-16">
          {/* ── Brand Logo ── */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group"
            onClick={closeMobile}
          >
            <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center shadow-gold group-hover:shadow-gold-lg transition-all duration-200">
              <span className="text-neutral-900 font-bold text-sm">E</span>
            </div>
            <span className="text-xl font-semibold text-neutral-100 tracking-tight">
              E-Commerce
            </span>
          </Link>

          {/* ── Desktop Nav Buttons (Right Side) ── */}
          <div className="hidden md:flex items-center gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.to + link.label}
                to={link.to}
                className={`relative btn-primary text-sm px-5 py-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                  isActive(link.to)
                    ? 'ring-2 ring-primary-300 ring-offset-2 ring-offset-neutral-950'
                    : ''
                }`}
              >
                {link.label}
                {/* Cart badge */}
                {link.label === 'Cart' && totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
                {/* Wishlist badge */}
                {link.label === 'Wishlist' && wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-pink-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1">
                    {wishlistCount > 99 ? '99+' : wishlistCount}
                  </span>
                )}
              </Link>
            ))}

            {/* ── Authenticated user info + Logout ── */}
            {isAuthenticated && (
              <>
                {user && (
                  <span className="text-xs text-neutral-500 px-2">
                    Hi, <span className="text-primary-400 font-medium">{user.name?.split(' ')[0]}</span>
                  </span>
                )}
                <button
                  onClick={handleLogout}
                  className="btn-primary text-sm px-5 py-2 rounded-lg transition-all duration-200 hover:scale-105 !bg-red-500/20 !text-red-400 hover:!bg-red-500/30"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* ── Mobile Menu Toggle ── */}
          <button
            id="mobile-menu-button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-neutral-400 hover:text-primary-400 transition-all duration-200"
            aria-label="Toggle Menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ── Mobile Dropdown Menu ── */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pb-4 pt-2 space-y-2 bg-neutral-900 border-t border-neutral-800">
          {navLinks.map((link) => (
            <Link
              key={link.to + link.label}
              to={link.to}
              onClick={closeMobile}
              className="relative block btn-primary text-sm text-center px-4 py-3 min-h-[44px] rounded-xl font-medium transition-all duration-200"
            >
              {link.label}
              {/* Cart badge (mobile) */}
              {link.label === 'Cart' && totalItems > 0 && (
                <span className="ml-2 inline-flex items-center justify-center bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full px-1">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
              {/* Wishlist badge (mobile) */}
              {link.label === 'Wishlist' && wishlistCount > 0 && (
                <span className="ml-2 inline-flex items-center justify-center bg-pink-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full px-1">
                  {wishlistCount > 99 ? '99+' : wishlistCount}
                </span>
              )}
            </Link>
          ))}
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="w-full block text-sm text-center px-4 py-3 min-h-[44px] rounded-xl font-medium transition-all duration-200 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
