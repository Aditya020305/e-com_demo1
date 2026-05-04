import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';

/* ── Types ── */
export interface WishlistProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface WishlistContextType {
  wishlistItems: WishlistProduct[];
  addToWishlist: (product: WishlistProduct) => void;
  removeFromWishlist: (productId: string) => void;
  toggleWishlist: (product: WishlistProduct) => void;
  isInWishlist: (productId: string) => boolean;
  wishlistCount: number;
}

const STORAGE_KEY = 'ecom_wishlist';

/* ── Context ── */
const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

/* ── Provider ── */
export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistProduct[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Persist to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlistItems));
    } catch {
      // localStorage may be unavailable
    }
  }, [wishlistItems]);

  const addToWishlist = useCallback((product: WishlistProduct) => {
    setWishlistItems((prev) => {
      if (prev.some((p) => p.id === product.id)) return prev;
      return [...prev, product];
    });
  }, []);

  const removeFromWishlist = useCallback((productId: string) => {
    setWishlistItems((prev) => prev.filter((p) => p.id !== productId));
  }, []);

  const isInWishlist = useCallback(
    (productId: string) => wishlistItems.some((p) => p.id === productId),
    [wishlistItems],
  );

  const toggleWishlist = useCallback(
    (product: WishlistProduct) => {
      if (isInWishlist(product.id)) {
        removeFromWishlist(product.id);
      } else {
        addToWishlist(product);
      }
    },
    [isInWishlist, removeFromWishlist, addToWishlist],
  );

  const wishlistCount = wishlistItems.length;

  const value = useMemo(
    () => ({
      wishlistItems,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      isInWishlist,
      wishlistCount,
    }),
    [wishlistItems, addToWishlist, removeFromWishlist, toggleWishlist, isInWishlist, wishlistCount],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

/* ── Hook ── */
export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
