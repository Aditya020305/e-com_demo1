import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import {
  fetchCart as apiFetchCart,
  addToCart as apiAddToCart,
  updateCartItem as apiUpdateCartItem,
  removeCartItem as apiRemoveCartItem,
} from '../services/cartService';
import type { CartItem as ApiCartItem } from '../services/cartService';

/* ── Types ── */
export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  loading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (productId: string) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

/* ── Map API item → UI item ── */
const mapItem = (item: ApiCartItem): CartItem => ({
  id: item.product._id,
  name: item.product.name,
  price: item.product.price,
  image: item.product.images?.[0] || '/products/headphones.png',
  quantity: item.quantity,
});

/* ── Context ── */
const CartContext = createContext<CartContextType | undefined>(undefined);

/* ── Provider ── */
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setCartItems([]);
      return;
    }
    setLoading(true);
    try {
      const res = await apiFetchCart();
      const items = res.data.items || [];
      setCartItems(items.map(mapItem));
    } catch {
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /* Load cart when token exists */
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = useCallback(async (productId: string) => {
    setLoading(true);
    try {
      const res = await apiAddToCart(productId, 1);
      setCartItems(res.data.items.map(mapItem));
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  const removeFromCart = useCallback(async (productId: string) => {
    setLoading(true);
    try {
      const res = await apiRemoveCartItem(productId);
      setCartItems(res.data.items.map(mapItem));
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  const updateQuantity = useCallback(async (productId: string, quantity: number) => {
    if (quantity < 1) return;
    setLoading(true);
    try {
      const res = await apiUpdateCartItem(productId, quantity);
      setCartItems(res.data.items.map(mapItem));
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const totalItems = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  );

  const totalPrice = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems],
  );

  const value = useMemo(
    () => ({
      cartItems,
      loading,
      fetchCart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
    }),
    [cartItems, loading, fetchCart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

/* ── Hook ── */
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
