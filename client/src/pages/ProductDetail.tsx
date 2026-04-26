import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../store/CartContext';
import Button from '../components/ui/Button';

/* ── Types ── */
interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  badge?: string;
  description: string;
  features: string[];
}

/* ── Mock Data ── */
const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Noir Pro Headphones',
    price: 249.99,
    originalPrice: 349.99,
    image: '/products/headphones.png',
    category: 'Audio',
    rating: 4.8,
    reviews: 324,
    badge: 'Best Seller',
    description:
      'Experience unparalleled sound quality with the Noir Pro Headphones. Featuring active noise cancellation, 40mm custom drivers, and up to 30 hours of battery life. The premium memory foam ear cushions provide all-day comfort, while the matte black finish with gold accents adds a touch of luxury.',
    features: [
      'Active Noise Cancellation (ANC)',
      '40mm custom-tuned drivers',
      '30-hour battery life',
      'Bluetooth 5.3 connectivity',
      'Premium memory foam cushions',
      'Foldable design with carry case',
    ],
  },
  {
    id: 2,
    name: 'Luxe Smartwatch',
    price: 399.99,
    image: '/products/watch.png',
    category: 'Wearables',
    rating: 4.9,
    reviews: 518,
    badge: 'New',
    description:
      'The Luxe Smartwatch combines cutting-edge technology with timeless elegance. Track your fitness, monitor your health, and stay connected — all from your wrist. AMOLED display, titanium case, and sapphire crystal glass make this watch as durable as it is beautiful.',
    features: [
      '1.4" AMOLED always-on display',
      'Titanium case with sapphire crystal',
      'Heart rate & SpO2 monitoring',
      '5ATM water resistance',
      '7-day battery life',
      'GPS + NFC payments',
    ],
  },
  {
    id: 3,
    name: 'Urban Stealth Sneakers',
    price: 189.99,
    originalPrice: 229.99,
    image: '/products/sneakers.png',
    category: 'Footwear',
    rating: 4.7,
    reviews: 206,
    description:
      'Step into the future with Urban Stealth Sneakers. Engineered with responsive cushioning and breathable knit uppers, these sneakers deliver unmatched comfort for all-day wear. The black and gold colorway makes a bold statement on any occasion.',
    features: [
      'Responsive foam midsole',
      'Breathable knit upper',
      'Rubber outsole with traction pattern',
      'Padded collar and tongue',
      'Pull-tab for easy on/off',
      'Available in sizes 6–13',
    ],
  },
  {
    id: 4,
    name: 'Heritage Leather Bag',
    price: 299.99,
    image: '/products/bag.png',
    category: 'Accessories',
    rating: 4.6,
    reviews: 142,
    description:
      'Crafted from full-grain Italian leather, the Heritage Bag is built to last a lifetime. Multiple compartments keep you organized, while the adjustable shoulder strap and top handles give you versatile carrying options. Ages beautifully with a rich patina over time.',
    features: [
      'Full-grain Italian leather',
      'Padded 15" laptop compartment',
      'Brass hardware with gold finish',
      'Adjustable shoulder strap',
      'Interior organizer pockets',
      'Dust bag included',
    ],
  },
  {
    id: 5,
    name: 'Aviator Gold Sunglasses',
    price: 159.99,
    originalPrice: 199.99,
    image: '/products/sunglasses.png',
    category: 'Eyewear',
    rating: 4.5,
    reviews: 97,
    badge: 'Sale',
    description:
      'Classic aviator silhouette reimagined with modern materials. Lightweight titanium frame with 24K gold-plated accents. Polarized lenses provide 100% UV protection while reducing glare for crystal-clear vision.',
    features: [
      'Polarized UV400 lenses',
      'Lightweight titanium frame',
      '24K gold-plated accents',
      'Spring hinges for comfort',
      'Anti-scratch lens coating',
      'Premium hard case included',
    ],
  },
  {
    id: 6,
    name: 'Shadow Wireless Earbuds',
    price: 129.99,
    image: '/products/earbuds.png',
    category: 'Audio',
    rating: 4.4,
    reviews: 263,
    description:
      'Ultra-compact true wireless earbuds with deep bass and crystal-clear mids. The ergonomic design fits securely in your ear for workouts, commutes, and everything in between. Touch controls and voice assistant support make them effortless to use.',
    features: [
      'True wireless with Bluetooth 5.2',
      '8-hour playtime (32 with case)',
      'IPX5 sweat & water resistant',
      'Touch controls',
      'Ambient mode & ANC',
      'Wireless charging case',
    ],
  },
  {
    id: 7,
    name: 'Atlas Travel Backpack',
    price: 179.99,
    image: '/products/backpack.png',
    category: 'Bags',
    rating: 4.8,
    reviews: 185,
    badge: 'Trending',
    description:
      'Designed for the modern traveler, the Atlas Backpack features a TSA-friendly laptop compartment, anti-theft hidden pockets, and water-resistant fabric. Expandable design goes from 25L to 35L for maximum flexibility.',
    features: [
      'Expandable 25L–35L capacity',
      'TSA-friendly laptop compartment',
      'Anti-theft hidden back pocket',
      'Water-resistant 900D fabric',
      'USB charging port',
      'Luggage pass-through strap',
    ],
  },
  {
    id: 8,
    name: 'Monarch Leather Wallet',
    price: 89.99,
    originalPrice: 119.99,
    image: '/products/wallet.png',
    category: 'Accessories',
    rating: 4.3,
    reviews: 74,
    description:
      'The Monarch Wallet is a slim bifold crafted from top-grain leather with RFID-blocking technology. Eight card slots, two bill compartments, and an ID window keep everything organized without the bulk.',
    features: [
      'Top-grain leather construction',
      'RFID-blocking technology',
      '8 card slots + 2 bill sections',
      'ID window',
      'Slim bifold design',
      'Gift box packaging',
    ],
  },
];

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

/* ========================================
   Product Detail Page
   ======================================== */
const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'features'>('description');

  const product = PRODUCTS.find((p) => p.id === Number(id));

  /* Not found */
  if (!product) {
    return (
      <section className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-neutral-900 px-4">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-neutral-800 border border-neutral-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-neutral-100 mb-2">Product Not Found</h1>
          <p className="text-neutral-500 mb-8">The product you're looking for doesn't exist or has been removed.</p>
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

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      });
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <section className="bg-neutral-900 min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 sm:py-12">
        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-8">
          <Link to="/" className="hover:text-primary-400 transition-colors duration-200">Home</Link>
          <span>/</span>
          <span className="text-neutral-400">{product.category}</span>
          <span>/</span>
          <span className="text-primary-400">{product.name}</span>
        </nav>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* ── LEFT: Image ── */}
          <div className="relative">
            <div className="sticky top-24 rounded-xl border border-neutral-800 bg-neutral-800/50 overflow-hidden aspect-square">
              {/* Badge */}
              {product.badge && (
                <div className={`absolute top-4 left-4 z-10 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider ${
                  product.badge === 'Sale'
                    ? 'bg-red-500/90 text-white'
                    : product.badge === 'New'
                    ? 'bg-emerald-500/90 text-white'
                    : 'bg-primary-500/90 text-neutral-900'
                }`}>
                  {product.badge}
                </div>
              )}
              {discount && (
                <div className="absolute top-4 right-4 z-10 px-3 py-1.5 rounded-lg bg-red-500/90 text-white text-xs font-bold">
                  -{discount}%
                </div>
              )}
              <img
                src={product.image}
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
              <StarRating rating={product.rating} />
              <span className="text-sm text-primary-400 font-semibold">{product.rating}</span>
              <span className="text-sm text-neutral-500">({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-neutral-800">
              <span className="text-3xl font-bold text-primary-400">${product.price}</span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-neutral-500 line-through">${product.originalPrice}</span>
                  <span className="px-2 py-0.5 rounded-md bg-red-500/10 text-red-400 text-xs font-bold">
                    Save ${(product.originalPrice - product.price).toFixed(2)}
                  </span>
                </>
              )}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-4">
              <button
                onClick={() => setActiveTab('description')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === 'description'
                    ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20'
                    : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab('features')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === 'features'
                    ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20'
                    : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                Features
              </button>
            </div>

            {/* Tab Content */}
            <div className="mb-8 min-h-[120px]">
              {activeTab === 'description' ? (
                <p className="text-sm text-neutral-400 leading-relaxed">
                  {product.description}
                </p>
              ) : (
                <ul className="space-y-2">
                  {product.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-neutral-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-400 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Quantity + Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              {/* Quantity */}
              <div className="flex items-center rounded-xl border border-neutral-700 bg-neutral-800 overflow-hidden transition-all duration-200">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 text-neutral-400 hover:text-primary-400 hover:bg-neutral-700 transition-all duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
                <span className="px-5 py-3 text-sm font-semibold text-neutral-100 min-w-[3rem] text-center border-x border-neutral-700">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-3 text-neutral-400 hover:text-primary-400 hover:bg-neutral-700 transition-all duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              {/* Add to Cart */}
              <Button
                onClick={handleAddToCart}
                variant="primary"
                size="lg"
                className={`flex-1 ${
                  addedToCart
                    ? '!bg-emerald-500 !from-emerald-500 !to-emerald-500 !text-white !shadow-lg'
                    : ''
                }`}
              >
                {addedToCart ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                    </svg>
                    Add to Cart — ${(product.price * quantity).toFixed(2)}
                  </>
                )}
              </Button>

              {/* Wishlist */}
              <button className="p-3 rounded-xl border border-neutral-700 bg-neutral-800 text-neutral-400 hover:text-primary-400 hover:border-primary-500/30 transition-all duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
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
      </div>
    </section>
  );
};

export default ProductDetail;
