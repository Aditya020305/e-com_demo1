import React, { useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  /** Highlight the active route link */
  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/login', label: 'Sign In' },
    { to: '/signup', label: 'Sign Up' },
  ];

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
                key={link.to}
                to={link.to}
                className={`btn-primary text-sm px-5 py-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                  isActive(link.to)
                    ? 'ring-2 ring-primary-300 ring-offset-2 ring-offset-neutral-950'
                    : ''
                }`}
              >
                {link.label}
              </Link>
            ))}
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
          mobileOpen ? 'max-h-72 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pb-4 pt-2 space-y-2 bg-neutral-900 border-t border-neutral-800">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={closeMobile}
              className="block btn-primary text-sm text-center px-4 py-3 min-h-[44px] rounded-xl font-medium transition-all duration-200"
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
