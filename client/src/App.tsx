import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

/* ── Context ── */
import { CartProvider } from './store/CartContext';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';

/* ── Components ── */
import Navbar from './components/Navbar';
import ProtectedVendorRoute from './components/ProtectedVendorRoute';

/* ── Pages ── */
import Home from './pages/Home';
import Products from './pages/Products';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Orders from './pages/Orders';
import Wishlist from './pages/Wishlist';

/* ── Vendor Pages ── */
import VendorDashboard from './pages/vendor/VendorDashboard';
import VendorProducts from './pages/vendor/VendorProducts';
import AddProduct from './pages/vendor/AddProduct';
import EditProduct from './pages/vendor/EditProduct';
import VendorOrders from './pages/vendor/VendorOrders';
import VendorRegister from './pages/vendor/VendorRegister';

/* ========================================
   Footer Component
   ======================================== */
const footerLinks = {
  explore: [
    { label: 'Shop Local', to: '/products' },
    { label: 'My Orders', to: '/orders' },
    { label: 'Cart', to: '/cart' },
    { label: 'Wishlist', to: '/wishlist' },
  ],
  sellers: [
    { label: 'Become a Vendor', to: '/vendor/register' },
    { label: 'Vendor Login', to: '/login?role=vendor' },
    { label: 'Seller Dashboard', to: '/vendor/dashboard' },
  ],
};

const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-950 border-t border-neutral-800 text-neutral-500">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        {/* ── Top Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center shadow-gold">
                <span className="text-neutral-900 font-bold text-sm">J</span>
              </div>
              <span className="text-lg font-bold text-neutral-100">JabalpurMart</span>
            </div>
            <p className="text-xs text-neutral-500 leading-relaxed max-w-xs">
              Connecting Jabalpur citizens with trusted local shops and vendors through a modern digital marketplace.
            </p>
            <p className="text-[10px] text-primary-400/70 font-medium mt-3">
              Supporting local businesses across Jabalpur ❤️
            </p>
          </div>

          {/* Explore Local */}
          <div>
            <h4 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-3">Explore Local</h4>
            <ul className="space-y-2">
              {footerLinks.explore.map((link) => (
                <li key={link.to}>
                  <a href={link.to} className="text-xs text-neutral-500 hover:text-primary-400 transition-colors duration-200">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Local Sellers */}
          <div>
            <h4 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-3">Local Sellers</h4>
            <ul className="space-y-2">
              {footerLinks.sellers.map((link) => (
                <li key={link.to}>
                  <a href={link.to} className="text-xs text-neutral-500 hover:text-primary-400 transition-colors duration-200">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Marketplace Support */}
          <div>
            <h4 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-3">Marketplace Support</h4>
            <ul className="space-y-2">
              <li className="text-xs text-neutral-500">Help for Buyers & Sellers</li>
              <li className="text-xs text-neutral-500">support@jabalpurmart.com</li>
            </ul>
            {/* Trust indicators */}
            <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1">
              {['🔒 Secure', '✅ Trusted', '🚚 Fast'].map((t) => (
                <span key={t} className="text-[10px] text-neutral-600">{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div className="border-t border-neutral-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[11px] text-neutral-600">
            &copy; {new Date().getFullYear()} JabalpurMart. Empowering local commerce digitally.
          </p>
          <p className="text-[10px] text-neutral-700">
            Made for Jabalpur. Built for local businesses.
          </p>
        </div>
      </div>
    </footer>
  );
};

/* ========================================
   App — Root Component with Routing
   ======================================== */
const App: React.FC = () => {
  return (
    <AuthProvider>
    <BrowserRouter>
      <WishlistProvider>
      <CartProvider>
        <div className="min-h-screen flex flex-col bg-neutral-900">
          <Navbar />

          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/wishlist" element={<Wishlist />} />

              {/* ── Vendor Routes ── */}
              <Route path="/vendor/register" element={<VendorRegister />} />
              <Route
                path="/vendor/dashboard"
                element={
                  <ProtectedVendorRoute>
                    <VendorDashboard />
                  </ProtectedVendorRoute>
                }
              />
              <Route
                path="/vendor/products"
                element={
                  <ProtectedVendorRoute>
                    <VendorProducts />
                  </ProtectedVendorRoute>
                }
              />
              <Route
                path="/vendor/add-product"
                element={
                  <ProtectedVendorRoute>
                    <AddProduct />
                  </ProtectedVendorRoute>
                }
              />
              <Route
                path="/vendor/edit-product/:id"
                element={
                  <ProtectedVendorRoute>
                    <EditProduct />
                  </ProtectedVendorRoute>
                }
              />
              <Route
                path="/vendor/orders"
                element={
                  <ProtectedVendorRoute>
                    <VendorOrders />
                  </ProtectedVendorRoute>
                }
              />
            </Routes>
          </main>

          <Footer />
        </div>
      </CartProvider>
      </WishlistProvider>
    </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
