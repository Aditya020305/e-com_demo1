/**
 * Category-based fallback images for products without uploaded images.
 * Uses high-quality placeholder SVG data URIs for each category.
 */

const CATEGORY_FALLBACKS: Record<string, string> = {
  'Mobile Phones': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&auto=format',
  'Laptops': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop&auto=format',
  'Tablets': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop&auto=format',
  'Audio': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&auto=format',
  'Wearables': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&auto=format',
  'Cameras': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop&auto=format',
  'Gaming': 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400&h=400&fit=crop&auto=format',
  'Home Appliances': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&auto=format',
  'Kitchen Appliances': 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop&auto=format',
  'Fashion (Men)': 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=400&h=400&fit=crop&auto=format',
  'Fashion (Women)': 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=400&fit=crop&auto=format',
  'Footwear': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&auto=format',
  'Accessories': 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&h=400&fit=crop&auto=format',
  'Furniture': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop&auto=format',
  'Books': 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop&auto=format',
  'Beauty & Personal Care': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop&auto=format',
  'Sports & Fitness': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=400&fit=crop&auto=format',
  'Office Supplies': 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=400&fit=crop&auto=format',
};

const GENERIC_FALLBACK = '/products/headphones.png';

/**
 * Returns a category-specific fallback image URL.
 * Falls back to a generic placeholder if the category is not recognized.
 */
export const getCategoryFallbackImage = (category?: string): string => {
  if (!category) return GENERIC_FALLBACK;
  return CATEGORY_FALLBACKS[category] || GENERIC_FALLBACK;
};

export default getCategoryFallbackImage;
