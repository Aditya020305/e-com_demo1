import React, { useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../store/CartContext';

const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { totalItems } = useCart();

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  /** Highlight the active route link */
  const isActive = (path: string) => location.pathname === path;

  const linkClass = (path: string) =>
    `relative text-sm font-medium transition-all duration-200 hover:scale-105 ${
      isActive(path)
        ? 'text-primary-400'
        : 'text-neutral-300 hover:text-primary-400'
    }`;

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/cart', label: 'Cart' },
    { to: '/login', label: 'Login' },
    { to: '/signup', label: 'Signup' },
  ];

  return (
    <nav className="bg-neutral-950/90 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
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

          {/* ── Desktop Nav Links ── */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} className={linkClass(link.to)}>
                {link.label}
                {isActive(link.to) && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary-400 rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* ── Action Buttons ── */}
          <div className="flex items-center gap-3">
            {/* Cart Icon */}
            <Link
              to="/cart"
              id="cart-button"
              className="relative p-2 text-neutral-400 hover:text-primary-400 transition-all duration-200 hover:scale-105"
              aria-label="Shopping Cart"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
                />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary-500 text-neutral-900 text-[10px] leading-none rounded-full h-4 w-4 flex items-center justify-center font-bold">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>

            {/* Desktop Sign-In */}
            <Link
              to="/login"
              id="login-button"
              className="hidden sm:inline-flex btn-primary text-sm px-5 py-2 rounded-lg transition-all duration-200 hover:scale-105"
            >
              Sign In
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              id="mobile-menu-button"
              onClick={() => setMobileOpen((prev) => !prev)}
              className="md:hidden p-2 text-neutral-400 hover:text-primary-400 transition-all duration-200"
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
      </div>

      {/* ── Mobile Dropdown Menu ── */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? 'max-h-72 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pb-4 pt-2 space-y-1 bg-neutral-900 border-t border-neutral-800">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={closeMobile}
              className={`block px-4 py-2.5 rounded-xl text-sm font-medium ${
                isActive(link.to)
                  ? 'bg-primary-500/10 text-primary-400 font-semibold'
                  : 'text-neutral-300 hover:bg-neutral-800 hover:text-primary-400'
              } transition-all duration-200`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
