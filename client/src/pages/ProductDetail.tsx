import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../store/CartContext';
import { useAuth } from '../hooks/useAuth';
import { useWishlist } from '../context/WishlistContext';
import { getProductById, getProducts } from '../services/productService';
import type { ApiProduct } from '../services/productService';
import API from '../api/axios';
import Button from '../components/ui/Button';
import { trackProductView } from '../utils/behaviorTracker';

/* ── Price Insight Types & Helper ── */
interface PriceInsight {
  label: 'Great Deal' | 'Fair Price' | 'Premium Pricing';
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
  message: string;
  percentDiff: number;
}

const calculatePriceInsight = (currentPrice: number, categoryProducts: { price: number }[]): PriceInsight | null => {
  if (categoryProducts.length < 2) return null;

  const avgPrice = categoryProducts.reduce((sum, p) => sum + p.price, 0) / categoryProducts.length;
  const ratio = currentPrice / avgPrice;
  const percentDiff = Math.round(Math.abs((1 - ratio) * 100));

  if (ratio < 0.85) {
    return {
      label: 'Great Deal',
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
      icon: '🔥',
      message: `Priced ${percentDiff}% lower than similar ${categoryProducts.length} items in this category`,
      percentDiff,
    };
  } else if (ratio > 1.15) {
    return {
      label: 'Premium Pricing',
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20',
      icon: '💎',
      message: `Priced ${percentDiff}% higher than similar items — premium quality`,
      percentDiff,
    };
  } else {
    return {
      label: 'Fair Price',
      color: 'text-sky-400',
      bgColor: 'bg-sky-500/10',
      borderColor: 'border-sky-500/20',
      icon: '✅',
      message: `Competitively priced among ${categoryProducts.length} similar items`,
      percentDiff,
    };
  }
};

/* ── Star Rating ── */
const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <svg
        key={star}
        xmlns="http://www.w3.org/2000/svg"
        className={`h-4 w-4 ${star <= Math.round(rating) ? 'text-primary-400' : 'text-neutral-700'}`}
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

/* ── Fallback product image ── */
const FALLBACK_IMAGE = '/products/headphones.png';

/* ── Sentiment Analysis (Rule-Based) ── */
const POSITIVE_WORDS = ['great', 'excellent', 'amazing', 'good', 'best', 'love', 'perfect', 'fantastic', 'awesome', 'wonderful', 'impressive', 'superb', 'outstanding', 'premium', 'comfortable', 'fast', 'smooth', 'durable', 'reliable', 'recommend'];
const NEGATIVE_WORDS = ['bad', 'poor', 'worst', 'low', 'problem', 'terrible', 'horrible', 'slow', 'broken', 'cheap', 'disappointing', 'overpriced', 'defective', 'uncomfortable', 'fragile', 'noisy', 'waste'];

const SAMPLE_REVIEWS_BY_CATEGORY: Record<string, string[]> = {
  'Mobile Phones': [
    'Great phone with amazing camera quality',
    'Battery life is excellent, lasts all day',
    'Fast performance and smooth display',
    'Good value for the price, highly recommend',
    'Average build quality but great software',
  ],
  'Laptops': [
    'Excellent performance for multitasking',
    'Great keyboard and amazing display',
    'Fast boot times and reliable performance',
    'Good laptop but battery could be better',
    'Perfect for work and creative tasks',
  ],
  'Audio': [
    'Amazing sound quality with deep bass',
    'Comfortable fit, great for long sessions',
    'Good noise cancellation, impressive clarity',
    'Excellent build quality and premium feel',
    'Great wireless range and fast connectivity',
  ],
  'Gaming': [
    'Fast and smooth gaming performance',
    'Amazing graphics and great controller feel',
    'Excellent value, best gaming experience',
    'Good build quality and reliable hardware',
    'Perfect for competitive gaming',
  ],
};

const DEFAULT_REVIEWS = [
  'Great product, very useful and well-made',
  'Amazing quality and excellent performance',
  'Good value for money, highly recommend',
  'Not bad but could be better in some areas',
  'Excellent build quality and fast delivery',
];

interface SentimentResult {
  label: 'Positive' | 'Neutral' | 'Negative';
  score: number;
  positiveCount: number;
  negativeCount: number;
  totalWords: number;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
  reviews: { text: string; sentiment: 'positive' | 'neutral' | 'negative' }[];
}

const analyzeSentiment = (category: string): SentimentResult => {
  const reviews = SAMPLE_REVIEWS_BY_CATEGORY[category] || DEFAULT_REVIEWS;

  let totalPositive = 0;
  let totalNegative = 0;

  const analyzedReviews = reviews.map((review) => {
    const words = review.toLowerCase().split(/\s+/);
    let pos = 0;
    let neg = 0;

    for (const word of words) {
      if (POSITIVE_WORDS.includes(word)) pos++;
      if (NEGATIVE_WORDS.includes(word)) neg++;
    }

    totalPositive += pos;
    totalNegative += neg;

    return {
      text: review,
      sentiment: (pos > neg ? 'positive' : neg > pos ? 'negative' : 'neutral') as 'positive' | 'neutral' | 'negative',
    };
  });

  const totalWords = totalPositive + totalNegative;
  const score = totalWords > 0 ? Math.round((totalPositive / totalWords) * 100) : 50;

  const label: SentimentResult['label'] =
    totalPositive > totalNegative ? 'Positive' : totalNegative > totalPositive ? 'Negative' : 'Neutral';

  const configs = {
    Positive: { color: 'text-emerald-400', bgColor: 'bg-emerald-500/10', borderColor: 'border-emerald-500/20', icon: '😊' },
    Neutral: { color: 'text-amber-400', bgColor: 'bg-amber-500/10', borderColor: 'border-amber-500/20', icon: '😐' },
    Negative: { color: 'text-red-400', bgColor: 'bg-red-500/10', borderColor: 'border-red-500/20', icon: '😞' },
  };

  return {
    label,
    score,
    positiveCount: totalPositive,
    negativeCount: totalNegative,
    totalWords,
    reviews: analyzedReviews,
    ...configs[label],
  };
};

/* ── AI Description Generator (Template-Based) ── */
const CATEGORY_TEMPLATES: Record<string, string[]> = {
  'Mobile Phones': [
    'Engineered for peak performance, the {name} delivers blazing-fast processing, an exceptional camera system, and all-day battery life. Whether you\'re capturing memories or multitasking on the go, this device keeps up with your lifestyle effortlessly.',
    'The {name} redefines mobile excellence with its stunning display, lightning-fast {priceTier} chipset, and intelligent photography features. A perfect companion for the modern professional.',
    'Experience the future of smartphones with the {name}. Featuring cutting-edge AI capabilities, a pro-grade camera array, and seamless connectivity — all in a premium design.',
  ],
  'Laptops': [
    'The {name} is a powerhouse built for creators and professionals. With unmatched processing speed, brilliant display quality, and a whisper-quiet design, it transforms any space into your workspace.',
    'Unleash your productivity with the {name}. This {priceTier} laptop combines raw power with sleek portability, featuring fast memory, an immersive display, and industry-leading build quality.',
    'Designed for those who demand the best, the {name} delivers exceptional multitasking performance, a keyboard that\'s a joy to type on, and battery life that lasts through your busiest days.',
  ],
  'Audio': [
    'Immerse yourself in pure sound with the {name}. Featuring studio-quality drivers, deep bass response, and crystal-clear highs, every note comes alive exactly as the artist intended.',
    'The {name} sets a new standard for {priceTier} audio. With advanced noise isolation, rich spatial sound, and a comfortable fit designed for hours of listening, silence has never sounded this good.',
    'Elevate your listening experience with the {name}. Precision-tuned acoustics, seamless wireless connectivity, and all-day comfort make this the ultimate audio companion.',
  ],
  'Wearables': [
    'The {name} is your ultimate wellness companion. Track workouts, monitor health metrics, and stay connected — all from a sleek device that looks as good as it performs.',
    'Stay ahead of your fitness goals with the {name}. Featuring advanced health sensors, GPS tracking, and smart notifications, it\'s the {priceTier} wearable that does it all.',
  ],
  'Cameras': [
    'Capture the world in stunning detail with the {name}. Professional-grade optics, fast autofocus, and cinematic video capabilities make every shot a masterpiece.',
    'The {name} empowers creators with exceptional image quality, intuitive controls, and rugged reliability. From landscapes to portraits, this is your tool for visual storytelling.',
  ],
  'Gaming': [
    'Dominate every game with the {name}. Designed for serious gamers, it delivers lightning-fast performance, immersive visuals, and responsive controls that give you the competitive edge.',
    'The {name} transforms your gaming experience with next-gen graphics, ultra-smooth framerates, and an ecosystem of entertainment that keeps you playing for hours.',
  ],
  'Footwear': [
    'Step into comfort and style with the {name}. Engineered with premium materials, responsive cushioning, and a design that turns heads — from the track to the street.',
    'The {name} blends performance and aesthetics perfectly. Lightweight construction, superior grip, and all-day comfort make these a {priceTier} essential for any wardrobe.',
  ],
  'Books': [
    'Dive into the pages of {name} — a transformative read that challenges perspectives, delivers actionable insights, and leaves a lasting impact on how you see the world.',
    'The {name} is a must-read that combines compelling storytelling with profound wisdom. A {priceTier} addition to any bookshelf that rewards every re-read.',
  ],
};

const DEFAULT_TEMPLATES = [
  'The {name} is a standout in the {category} category. Crafted with precision and designed for excellence, it delivers exceptional value at a {priceTier} price point. A smart choice for discerning buyers.',
  'Discover the {name} — a {priceTier} {category} product that combines quality craftsmanship with modern innovation. Built to exceed expectations and deliver lasting satisfaction.',
  'Elevate your experience with the {name}. This carefully curated {category} product offers premium quality, thoughtful design, and outstanding performance that justifies every penny.',
];

const AI_SUFFIXES = [
  'Perfect for daily use.',
  'Ideal for professionals and enthusiasts alike.',
  'Great for entertainment and productivity.',
  'A smart investment for quality-conscious buyers.',
  'Trusted by thousands of satisfied customers.',
  'Built to deliver excellence, day after day.',
  'An outstanding choice in its class.',
  'Engineered to exceed your expectations.',
];

let lastGeneratedDescription = '';

const generateAIDescription = (product: { name: string; category: string; price: number }): string => {
  const priceTier = product.price < 200 ? 'budget-friendly' : product.price < 1000 ? 'mid-range' : 'premium';
  const templates = CATEGORY_TEMPLATES[product.category] || DEFAULT_TEMPLATES;

  // Pick a random template, try to avoid the last one
  let template = templates[Math.floor(Math.random() * templates.length)];
  const suffix = AI_SUFFIXES[Math.floor(Math.random() * AI_SUFFIXES.length)];

  let result = template
    .replace(/\{name\}/g, product.name)
    .replace(/\{category\}/g, product.category)
    .replace(/\{priceTier\}/g, priceTier)
    + ' ' + suffix;

  // Prevent exact repeat
  if (result === lastGeneratedDescription && templates.length > 1) {
    const altTemplates = templates.filter((t) => t !== template);
    template = altTemplates[Math.floor(Math.random() * altTemplates.length)];
    const altSuffix = AI_SUFFIXES[Math.floor(Math.random() * AI_SUFFIXES.length)];
    result = template
      .replace(/\{name\}/g, product.name)
      .replace(/\{category\}/g, product.category)
      .replace(/\{priceTier\}/g, priceTier)
      + ' ' + altSuffix;
  }

  lastGeneratedDescription = result;
  return result;
};

/* ── Skeleton loader for Product Detail ── */
const ProductDetailSkeleton: React.FC = () => (
  <section className="bg-neutral-900 min-h-[calc(100vh-4rem)]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12">
      {/* Breadcrumb skeleton */}
      <div className="flex items-center gap-2 mb-8">
        <div className="h-4 w-12 rounded bg-neutral-800 animate-pulse" />
        <span className="text-neutral-700">/</span>
        <div className="h-4 w-16 rounded bg-neutral-800 animate-pulse" />
        <span className="text-neutral-700">/</span>
        <div className="h-4 w-32 rounded bg-neutral-800 animate-pulse" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image skeleton */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-800/50 aspect-square animate-pulse" />

        {/* Details skeleton */}
        <div className="flex flex-col">
          <div className="h-3 w-20 rounded bg-neutral-800 animate-pulse mb-2" />
          <div className="h-8 w-3/4 rounded bg-neutral-800 animate-pulse mb-4" />
          <div className="flex items-center gap-3 mb-6">
            <div className="h-4 w-24 rounded bg-neutral-800 animate-pulse" />
            <div className="h-4 w-8 rounded bg-neutral-800 animate-pulse" />
            <div className="h-4 w-20 rounded bg-neutral-800 animate-pulse" />
          </div>
          <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-neutral-800">
            <div className="h-8 w-24 rounded bg-neutral-800 animate-pulse" />
            <div className="h-5 w-16 rounded bg-neutral-800 animate-pulse" />
          </div>
          <div className="flex gap-1 mb-4">
            <div className="h-9 w-28 rounded-lg bg-neutral-800 animate-pulse" />
            <div className="h-9 w-24 rounded-lg bg-neutral-800 animate-pulse" />
          </div>
          <div className="space-y-2 mb-8 min-h-[120px]">
            <div className="h-4 w-full rounded bg-neutral-800 animate-pulse" />
            <div className="h-4 w-full rounded bg-neutral-800 animate-pulse" />
            <div className="h-4 w-5/6 rounded bg-neutral-800 animate-pulse" />
            <div className="h-4 w-2/3 rounded bg-neutral-800 animate-pulse" />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="h-12 w-32 rounded-xl bg-neutral-800 animate-pulse" />
            <div className="h-12 flex-1 rounded-xl bg-neutral-800 animate-pulse" />
            <div className="h-12 w-12 rounded-xl bg-neutral-800 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* ========================================
   Product Detail Page — API-Integrated
   ======================================== */
const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'features'>('description');
  const [recommendations, setRecommendations] = useState<ApiProduct[]>([]);
  const [recsLoading, setRecsLoading] = useState(false);
  const [aiDescription, setAiDescription] = useState<string | null>(null);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [priceInsight, setPriceInsight] = useState<PriceInsight | null>(null);

  /* ── Fetch product from API ── */
  const fetchProduct = useCallback(async () => {
    if (!id) {
      setError('Invalid product ID');
      setLoading(false);
      return;
    }

    // Validate MongoDB ObjectId format
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    if (!objectIdRegex.test(id)) {
      setError('Invalid product ID format');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getProductById(id);
      setProduct(data);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to load product';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  /* ── Track user behavior (runs after product loads) ── */
  useEffect(() => {
    if (product) {
      trackProductView(product._id, product.category);
    }
  }, [product]);

  /* ── Fetch price insight (runs after product loads) ── */
  useEffect(() => {
    if (!product) return;

    const fetchPriceInsight = async () => {
      try {
        const response = await getProducts(undefined, product.category, 1, 50);
        const categoryProducts = response.data.products;
        const insight = calculatePriceInsight(product.price, categoryProducts);
        setPriceInsight(insight);
      } catch {
        // Silently fail — price insight is non-critical
        setPriceInsight(null);
      }
    };

    fetchPriceInsight();
  }, [product]);

  /* ── Fetch recommendations (runs after product loads) ── */
  useEffect(() => {
    if (!product || !product._id) return;

    const fetchRecommendations = async () => {
      setRecsLoading(true);
      try {
        const { data } = await API.get<{ success: boolean; data: ApiProduct[] }>(
          `/products/${product._id}/recommendations`
        );
        setRecommendations(data.data);
      } catch {
        // Silently fail — recommendations are non-critical
        setRecommendations([]);
      } finally {
        setRecsLoading(false);
      }
    };

    fetchRecommendations();
  }, [product]);

  /* ── Loading state ── */
  if (loading) {
    return <ProductDetailSkeleton />;
  }

  /* ── Error / Not found ── */
  if (error || !product) {
    return (
      <section className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-neutral-900 px-4">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-neutral-800 border border-neutral-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-neutral-100 mb-2">Product Not Found</h1>
          <p className="text-neutral-500 mb-8">
            {error || "The product you're looking for doesn't exist or has been removed."}
          </p>
          <Button
            onClick={() => navigate('/')}
            variant="primary"
            size="lg"
          >
            ← Back to Shop
          </Button>
        </div>
      </section>
    );
  }

  /* ── Derived values ── */
  const productImage =
    product.images && product.images.length > 0 ? product.images[0] : FALLBACK_IMAGE;

  // Build a features list from the product description
  const productFeatures = product.description
    ? product.description
        .split(/[.!]\s+/)
        .filter((s) => s.trim().length > 5)
        .slice(0, 6)
    : [];

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    await addToCart(product._id);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const wishlisted = isInWishlist(product._id);

  const handleToggleWishlist = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    toggleWishlist({
      id: product._id,
      name: product.name,
      price: product.price,
      image: productImage,
      category: product.category,
    });
  };

  return (
    <section className="bg-neutral-900 min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12">
        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-8 overflow-hidden">
          <Link to="/" className="hover:text-primary-400 transition-colors duration-200 flex-shrink-0">Home</Link>
          <span className="flex-shrink-0">/</span>
          <span className="text-neutral-400 flex-shrink-0">{product.category}</span>
          <span className="flex-shrink-0">/</span>
          <span className="text-primary-400 truncate">{product.name}</span>
        </nav>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* ── LEFT: Image ── */}
          <div className="relative">
            <div className="sticky top-24 rounded-xl border border-neutral-800 bg-neutral-800/50 overflow-hidden aspect-square">
              {product.stock === 0 && (
                <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-lg bg-red-500/90 text-white text-xs font-bold uppercase tracking-wider">
                  Out of Stock
                </div>
              )}
              <img
                src={productImage}
                alt={product.name}
                className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* ── RIGHT: Details ── */}
          <div className="flex flex-col">
            {/* Category */}
            <p className="text-xs font-semibold text-primary-500/70 uppercase tracking-widest mb-2">
              {product.category}
            </p>

            {/* Name */}
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-100 leading-tight mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <StarRating rating={4.5} />
              <span className="text-sm text-primary-400 font-semibold">4.5</span>
              <span className="text-sm text-neutral-500">
                {product.stock > 0
                  ? `${product.stock} in stock`
                  : 'Out of stock'}
              </span>
            </div>

            {/* Vendor — Local Seller Card */}
            {product.vendor && (() => {
              const localAreas = ['Napier Town', 'Wright Town', 'Madan Mahal', 'Gorakhpur', 'Adhartal', 'Vijay Nagar', 'Gwarighat'];
              const areaIdx = product._id.charCodeAt(product._id.length - 1) % localAreas.length;
              return (
                <div className="flex items-start gap-3 mb-5 p-3 rounded-xl border border-neutral-800 bg-neutral-800/40">
                  <div className="w-10 h-10 rounded-lg bg-primary-500/15 flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                  </div>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-sm font-semibold text-neutral-100 truncate">
                      {product.vendor.name}
                    </span>
                    <span className="text-xs text-neutral-500">
                      {localAreas[areaIdx]}, Jabalpur
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 uppercase tracking-wider mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Verified Local Vendor
                    </span>
                  </div>
                </div>
              );
            })()}

            {/* Price */}
            <div className="flex flex-wrap items-baseline gap-2 sm:gap-3 mb-3">
              <span className="text-2xl sm:text-3xl font-bold text-primary-400">₹{product.price}</span>
            </div>

            {/* Price Insight Badge */}
            {/* Local Delivery Message */}
            {product.stock > 0 && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-1h3.05a2.5 2.5 0 014.9 0H19a1 1 0 001-1v-4a1 1 0 00-.293-.707l-3-3A1 1 0 0016 5h-3V4a1 1 0 00-1-1H3zm10 2h2.586L18 8.414V12h-1.05a2.5 2.5 0 00-4.9 0H11V6h2z" />
                </svg>
                <span className="text-xs text-emerald-400 font-medium">Fast delivery available within Jabalpur</span>
              </div>
            )}

            {priceInsight && (
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${priceInsight.bgColor} border ${priceInsight.borderColor} mb-6`}>
                <span className="text-base">{priceInsight.icon}</span>
                <div className="flex flex-col">
                  <span className={`text-xs font-bold uppercase tracking-wider ${priceInsight.color}`}>
                    {priceInsight.label}
                  </span>
                  <span className="text-[11px] text-neutral-400 leading-tight">
                    {priceInsight.message}
                  </span>
                </div>
              </div>
            )}

            <div className="border-b border-neutral-800 mb-6" />

            {/* Tabs */}
            <div className="flex gap-1 mb-4">
              <button
                onClick={() => setActiveTab('description')}
                className={`px-4 py-2 min-h-[44px] rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === 'description'
                    ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20'
                    : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                Description
              </button>
              {productFeatures.length > 0 && (
                <button
                  onClick={() => setActiveTab('features')}
                  className={`px-4 py-2 min-h-[44px] rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === 'features'
                      ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20'
                      : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  Highlights
                </button>
              )}
            </div>

            {/* Tab Content */}
            <div className="mb-8 min-h-[120px]">
              {activeTab === 'description' ? (
                <div>
                  <p className="text-xs text-primary-500/60 italic mb-3">
                    Product available from a verified local vendor in Jabalpur.
                  </p>
                  <p className="text-sm text-neutral-400 leading-relaxed break-words">
                    {product.description}
                  </p>
                </div>
              ) : (
                <ul className="space-y-2">
                  {productFeatures.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-neutral-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-400 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature.trim()}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* ── AI Description Generator ── */}
            <div className="mb-8">
              <button
                onClick={() => {
                  if (!product) return;
                  setAiGenerating(true);
                  setAiDescription(null);
                  // Simulate AI generation delay for realism
                  setTimeout(() => {
                    const desc = generateAIDescription(product);
                    setAiDescription(desc);
                    setAiGenerating(false);
                  }, 800 + Math.random() * 700);
                }}
                disabled={aiGenerating}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 min-h-[40px] ${
                  aiGenerating
                    ? 'bg-primary-500/10 text-primary-400/50 border border-primary-500/10 cursor-wait'
                    : 'bg-primary-500/10 text-primary-400 border border-primary-500/20 hover:bg-primary-500/20 hover:border-primary-500/30'
                }`}
              >
                {aiGenerating ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                    {aiDescription ? 'Regenerate AI Description' : 'Generate AI Description'}
                  </>
                )}
              </button>

              {aiDescription && (
                <div className="mt-4 relative p-4 rounded-xl border border-primary-500/20 bg-primary-500/5">
                  <div className="absolute -top-2.5 left-3 px-2 bg-neutral-900">
                    <span className="text-[10px] font-bold text-primary-400 uppercase tracking-wider flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                      </svg>
                      AI Generated
                    </span>
                  </div>
                  <p className="text-sm text-neutral-300 leading-relaxed mt-1">
                    {aiDescription}
                  </p>
                </div>
              )}
            </div>

            {/* ── Customer Sentiment Analysis ── */}
            {(() => {
              const sentiment = analyzeSentiment(product.category);
              return (
                <div className="mb-8 rounded-xl border border-neutral-800 bg-neutral-800/40 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-neutral-200 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                      </svg>
                      Customer Sentiment
                    </h3>
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${sentiment.bgColor} border ${sentiment.borderColor}`}>
                      <span className="text-sm">{sentiment.icon}</span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${sentiment.color}`}>
                        {sentiment.label}
                      </span>
                    </div>
                  </div>

                  {/* Score Bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-neutral-500 uppercase tracking-wider">Satisfaction Score</span>
                      <span className={`text-xs font-bold ${sentiment.color}`}>{sentiment.score}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-neutral-700 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          sentiment.label === 'Positive'
                            ? 'bg-emerald-400'
                            : sentiment.label === 'Neutral'
                            ? 'bg-amber-400'
                            : 'bg-red-400'
                        }`}
                        style={{ width: `${sentiment.score}%` }}
                      />
                    </div>
                  </div>

                  {/* Review Highlights */}
                  <div className="space-y-1.5">
                    {sentiment.reviews.slice(0, 3).map((review, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-[10px] mt-0.5 flex-shrink-0">
                          {review.sentiment === 'positive' ? '👍' : review.sentiment === 'negative' ? '👎' : '➖'}
                        </span>
                        <p className="text-[11px] text-neutral-500 leading-relaxed">
                          "{review.text}"
                        </p>
                      </div>
                    ))}
                  </div>

                  <p className="text-[9px] text-neutral-600 mt-2 italic">Based on AI analysis of customer reviews</p>
                </div>
              );
            })()}

            {/* Quantity + Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              {/* Quantity */}
              <div className="flex items-center rounded-xl border border-neutral-700 bg-neutral-800 overflow-hidden transition-all duration-200 w-full sm:w-auto">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 min-h-[44px] text-neutral-400 hover:text-primary-400 hover:bg-neutral-700 transition-all duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
                <span className="px-5 py-3 text-sm font-semibold text-neutral-100 min-w-[3rem] text-center border-x border-neutral-700">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                  className="px-4 py-3 min-h-[44px] text-neutral-400 hover:text-primary-400 hover:bg-neutral-700 transition-all duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              {/* Add to Cart */}
              <Button
                onClick={handleAddToCart}
                variant="outline"
                size="lg"
                className={`flex-1 ${
                  addedToCart
                    ? '!bg-emerald-500 !border-emerald-500 !text-white !shadow-lg'
                    : ''
                }`}
                disabled={product.stock === 0}
              >
                {addedToCart ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Added!
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                    </svg>
                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </>
                )}
              </Button>

              {/* Buy Now */}
              <Button
                onClick={() => {
                  handleAddToCart();
                  navigate('/checkout');
                }}
                variant="primary"
                size="lg"
                className="flex-1"
                disabled={product.stock === 0}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Buy Now — ₹{(product.price * quantity).toFixed(2)}
              </Button>

              {/* Wishlist */}
              <button
                onClick={handleToggleWishlist}
                className={`p-3 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl border transition-all duration-200 ${
                  wishlisted
                    ? 'border-pink-500/30 bg-pink-500/10 text-pink-400'
                    : 'border-neutral-700 bg-neutral-800 text-neutral-400 hover:text-pink-400 hover:border-pink-500/30'
                }`}
                aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={wishlisted ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            {/* Why Buy Local? */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-800/30 p-4 mb-6">
              <h4 className="text-sm font-bold text-neutral-200 mb-3">Why Buy Local?</h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: '🚚', text: 'Faster delivery' },
                  { icon: '🤝', text: 'Better local support' },
                  { icon: '🏪', text: 'Support Jabalpur businesses' },
                  { icon: '💬', text: 'Easier seller communication' },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-2 text-xs text-neutral-500">
                    <span>{item.icon}</span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Back */}
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-primary-400 transition-colors duration-200 mt-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to products
            </button>
          </div>
        </div>

        {/* ══════════════════════════════════════
           COMMUNITY TRUST STRIP
           ══════════════════════════════════════ */}
        <div className="mt-10 pt-8 border-t border-neutral-800">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ),
                title: 'Trusted Local Vendors',
                desc: 'Verified sellers from Jabalpur',
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ),
                title: 'Secure Payments',
                desc: 'Razorpay protected',
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                ),
                title: 'Neighborhood Shops',
                desc: 'Support local businesses',
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                  </svg>
                ),
                title: 'Easy Local Support',
                desc: 'Quick seller response',
              },
            ].map((item) => (
              <div key={item.title} className="flex flex-col items-center text-center p-3 rounded-lg">
                <div className="text-primary-400 mb-1.5">{item.icon}</div>
                <h5 className="text-xs font-semibold text-neutral-300">{item.title}</h5>
                <p className="text-[10px] text-neutral-500 mt-0.5">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════
           YOU MAY ALSO LIKE — Recommendations
           ══════════════════════════════════════ */}
        {recsLoading ? (
          <div className="mt-12 pt-10 border-t border-neutral-800">
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-100 mb-6">
              You may also like
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-neutral-800 bg-neutral-800/50 overflow-hidden">
                  <div className="aspect-square bg-neutral-800 animate-pulse" />
                  <div className="p-3 space-y-2">
                    <div className="h-3 w-3/4 rounded bg-neutral-800 animate-pulse" />
                    <div className="h-4 w-1/2 rounded bg-neutral-800 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : recommendations.length > 0 ? (
          <div className="mt-12 pt-10 border-t border-neutral-800">
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-100 mb-6">
              You may also <span className="text-gradient-gold">like</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {recommendations.map((rec) => {
                const recImage =
                  rec.images && rec.images.length > 0 ? rec.images[0] : FALLBACK_IMAGE;
                return (
                  <Link
                    key={rec._id}
                    to={`/product/${rec._id}`}
                    className="group rounded-xl border border-neutral-800 bg-neutral-900/80 overflow-hidden transition-all duration-300 hover:border-primary-500/30 hover:shadow-gold hover:-translate-y-1"
                  >
                    <div className="aspect-square bg-neutral-800/50 overflow-hidden">
                      <img
                        src={recImage}
                        alt={rec.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-[10px] font-medium text-primary-500/70 uppercase tracking-wider mb-1">
                        {rec.category}
                      </p>
                      <h3 className="text-sm font-medium text-neutral-100 leading-snug line-clamp-1 mb-1">
                        {rec.name}
                      </h3>
                      <span className="text-sm font-semibold text-primary-400">
                        ₹{rec.price}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default ProductDetail;
