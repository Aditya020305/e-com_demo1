/**
 * User Behavior Tracker — localStorage-based
 * ─────────────────────────────────────────────
 * Tracks recently viewed products and preferred categories
 * for personalized "Recommended for You" suggestions.
 */

const STORAGE_KEYS = {
  RECENTLY_VIEWED: 'ecom_recently_viewed',
  PREFERRED_CATEGORIES: 'ecom_preferred_categories',
} as const;

const MAX_RECENTLY_VIEWED = 10;
const MAX_PREFERRED_CATEGORIES = 8;

/** Record a product view: stores product ID + category */
export const trackProductView = (productId: string, category: string): void => {
  try {
    // Update recently viewed products
    const viewed: string[] = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.RECENTLY_VIEWED) || '[]'
    );
    const updated = [productId, ...viewed.filter((id) => id !== productId)].slice(
      0,
      MAX_RECENTLY_VIEWED
    );
    localStorage.setItem(STORAGE_KEYS.RECENTLY_VIEWED, JSON.stringify(updated));

    // Update preferred categories (weighted by frequency)
    const categories: string[] = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.PREFERRED_CATEGORIES) || '[]'
    );
    const updatedCats = [category, ...categories.filter((c) => c !== category)].slice(
      0,
      MAX_PREFERRED_CATEGORIES
    );
    localStorage.setItem(STORAGE_KEYS.PREFERRED_CATEGORIES, JSON.stringify(updatedCats));
  } catch {
    // localStorage may be unavailable — silently fail
  }
};

/** Get recently viewed product IDs */
export const getRecentlyViewed = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.RECENTLY_VIEWED) || '[]');
  } catch {
    return [];
  }
};

/** Get preferred categories (most recent first) */
export const getPreferredCategories = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PREFERRED_CATEGORIES) || '[]');
  } catch {
    return [];
  }
};
