import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

/* ── Context ── */
import { CartProvider } from './store/CartContext';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';

/* ── Components ── */
import Navbar from './components/Navbar';

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

/* ========================================
   Footer Component
   ======================================== */
const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-950 border-t border-neutral-800 text-neutral-500">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-neutral-900 font-bold text-sm">E</span>
            </div>
            <span className="text-lg font-bold text-neutral-100">E-Commerce</span>
          </div>
          <p className="text-sm">
            &copy; {new Date().getFullYear()} E-Commerce Platform. All rights reserved.
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
