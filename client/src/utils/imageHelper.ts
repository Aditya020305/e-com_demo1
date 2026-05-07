import { getCategoryFallbackImage } from './categoryImages';

/**
 * Derives the server origin from REACT_APP_API_URL.
 *
 * REACT_APP_API_URL is typically "http://localhost:5000/api".
 * We strip the trailing "/api" to get the bare server origin
 * so we can build correct URLs for static assets like uploads.
 */
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const SERVER_ORIGIN = API_URL.replace(/\/api\/?$/, '');

/**
 * Resolves a product image string to a fully-qualified URL that the
 * browser can load.
 *
 * Handles three cases:
 *  1. External URL (starts with "http")  → return as-is
 *  2. Uploaded file path ("/uploads/…")  → prepend server origin
 *  3. Falsy / missing                    → return category fallback or generic fallback
 *
 * @param image    - The raw image string from the API (e.g. "/uploads/products/img.jpg" or "https://…")
 * @param category - Optional product category for a smarter fallback image
 */
export const getImageSrc = (
  image: string | undefined | null,
  category?: string,
): string => {
  if (!image) {
    return getCategoryFallbackImage(category);
  }

  // Already a full URL or data URI — use as-is
  if (image.startsWith('http://') || image.startsWith('https://') || image.startsWith('data:')) {
    return image;
  }

  // Relative server path (e.g. /uploads/products/…) — prepend server origin
  return `${SERVER_ORIGIN}${image}`;
};

/**
 * Given a product's images array and category, return the best thumbnail URL.
 * Uses the first image if available, otherwise falls back to a category placeholder.
 */
export const getProductThumbnail = (
  images: string[] | undefined | null,
  category?: string,
): string => {
  const firstImage = images && images.length > 0 ? images[0] : undefined;
  return getImageSrc(firstImage, category);
};

export default getImageSrc;
