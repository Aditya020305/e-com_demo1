const products = [
  // ── Mobile Phones ──
  { name: "iPhone 15 Pro Max", description: "Apple's flagship smartphone with A17 Pro chip, titanium design, and 48MP camera system for stunning photos.", price: 1199, category: "Mobile Phones", stock: 45, images: ["https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=640&q=80"], isActive: true },
  { name: "Samsung Galaxy S24 Ultra", description: "Premium Android smartphone with S Pen, 200MP camera, Snapdragon 8 Gen 3, and titanium frame.", price: 1299, category: "Mobile Phones", stock: 38, images: ["https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=640&q=80"], isActive: true },
  { name: "Google Pixel 8 Pro", description: "Google's AI-powered smartphone with Tensor G3 chip, best-in-class computational photography.", price: 999, category: "Mobile Phones", stock: 52, images: ["https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=640&q=80"], isActive: true },

  // ── Laptops ──
  { name: "MacBook Pro 16-inch M3 Max", description: "Professional-grade laptop with Apple M3 Max chip, 36GB RAM, stunning Liquid Retina XDR display.", price: 3499, category: "Laptops", stock: 20, images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=640&q=80"], isActive: true },
  { name: "Dell XPS 15", description: "Ultra-thin laptop with 13th Gen Intel Core i7, OLED display, and premium build quality for professionals.", price: 1899, category: "Laptops", stock: 30, images: ["https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=640&q=80"], isActive: true },
  { name: "ThinkPad X1 Carbon Gen 11", description: "Business ultrabook with Intel vPro, MIL-STD tested durability, and legendary ThinkPad keyboard.", price: 1649, category: "Laptops", stock: 25, images: ["https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=640&q=80"], isActive: true },

  // ── Tablets ──
  { name: "iPad Pro 12.9-inch M2", description: "Powerful tablet with M2 chip, Liquid Retina XDR display, and Apple Pencil hover support.", price: 1099, category: "Tablets", stock: 35, images: ["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=640&q=80"], isActive: true },
  { name: "Samsung Galaxy Tab S9 Ultra", description: "Large 14.6-inch AMOLED tablet with Snapdragon 8 Gen 2, S Pen included, IP68 water resistance.", price: 1199, category: "Tablets", stock: 22, images: ["https://images.unsplash.com/photo-1561154464-82e9adf32764?w=640&q=80"], isActive: true },
  { name: "Microsoft Surface Pro 9", description: "Versatile 2-in-1 tablet with 12th Gen Intel Core, kickstand design, and Windows 11 productivity.", price: 1599, category: "Tablets", stock: 28, images: ["https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=640&q=80"], isActive: true },

  // ── Audio ──
  { name: "Sony WH-1000XM5", description: "Industry-leading noise cancelling headphones with exceptional sound quality and 30-hour battery life.", price: 349, category: "Audio", stock: 60, images: ["https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=640&q=80"], isActive: true },
  { name: "AirPods Pro 2nd Gen", description: "Apple wireless earbuds with active noise cancellation, adaptive transparency, and personalized spatial audio.", price: 249, category: "Audio", stock: 75, images: ["https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=640&q=80"], isActive: true },
  { name: "JBL Charge 5", description: "Portable Bluetooth speaker with powerful JBL Original Pro Sound, IP67 waterproof, and 20-hour playtime.", price: 179, category: "Audio", stock: 55, images: ["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=640&q=80"], isActive: true },
  { name: "Bose QuietComfort Ultra", description: "Premium noise cancelling headphones with immersive spatial audio and world-class comfort for all-day wear.", price: 429, category: "Audio", stock: 40, images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=640&q=80"], isActive: true },

  // ── Wearables ──
  { name: "Apple Watch Ultra 2", description: "Rugged smartwatch with precision dual-frequency GPS, 36-hour battery, and advanced health monitoring.", price: 799, category: "Wearables", stock: 30, images: ["https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=640&q=80"], isActive: true },
  { name: "Samsung Galaxy Watch 6 Classic", description: "Premium smartwatch with rotating bezel, comprehensive health tracking, and Wear OS by Google.", price: 399, category: "Wearables", stock: 42, images: ["https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=640&q=80"], isActive: true },
  { name: "Fitbit Charge 6", description: "Advanced fitness tracker with built-in GPS, heart rate monitoring, and 7-day battery life.", price: 159, category: "Wearables", stock: 65, images: ["https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=640&q=80"], isActive: true },

  // ── Cameras ──
  { name: "Sony Alpha A7 IV", description: "Full-frame mirrorless camera with 33MP sensor, real-time Eye AF, and 4K 60p video recording.", price: 2498, category: "Cameras", stock: 15, images: ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=640&q=80"], isActive: true },
  { name: "Canon EOS R6 Mark II", description: "Hybrid mirrorless camera with 24.2MP sensor, up to 40fps shooting, and advanced subject detection AF.", price: 2499, category: "Cameras", stock: 18, images: ["https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=640&q=80"], isActive: true },
  { name: "GoPro HERO12 Black", description: "Waterproof action camera with 5.3K video, HyperSmooth 6.0 stabilization, and HDR photo capability.", price: 399, category: "Cameras", stock: 50, images: ["https://images.unsplash.com/photo-1564466809058-bf4114d55352?w=640&q=80"], isActive: true },

  // ── Gaming ──
  { name: "PlayStation 5 Console", description: "Next-gen gaming console with ultra-high speed SSD, ray tracing, 4K gaming, and DualSense controller.", price: 499, category: "Gaming", stock: 25, images: ["https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=640&q=80"], isActive: true },
  { name: "Xbox Series X", description: "Most powerful Xbox ever with 12 teraflops, 4K gaming at 120fps, and Xbox Game Pass compatibility.", price: 499, category: "Gaming", stock: 22, images: ["https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=640&q=80"], isActive: true },
  { name: "Nintendo Switch OLED", description: "Versatile hybrid gaming console with vibrant 7-inch OLED screen and detachable Joy-Con controllers.", price: 349, category: "Gaming", stock: 40, images: ["https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=640&q=80"], isActive: true },
  { name: "Razer BlackWidow V4 Pro", description: "Mechanical gaming keyboard with Razer Green switches, Chroma RGB lighting, and command dial.", price: 229, category: "Gaming", stock: 35, images: ["https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=640&q=80"], isActive: true },

  // ── Home Appliances ──
  { name: "Dyson V15 Detect", description: "Cordless vacuum with laser dust detection, piezo sensor, and HEPA filtration for whole-home cleaning.", price: 749, category: "Home Appliances", stock: 30, images: ["https://images.unsplash.com/photo-1558317374-067fb5f30001?w=640&q=80"], isActive: true },
  { name: "LG OLED C3 65-inch TV", description: "Stunning 4K OLED smart TV with self-lit pixels, Dolby Vision, and webOS entertainment platform.", price: 1799, category: "Home Appliances", stock: 15, images: ["https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=640&q=80"], isActive: true },
  { name: "Roomba j7+ Robot Vacuum", description: "Smart robot vacuum with PrecisionVision Navigation, self-emptying base, and obstacle avoidance.", price: 599, category: "Home Appliances", stock: 28, images: ["https://images.unsplash.com/photo-1589894404892-7310b92ea7a2?w=640&q=80"], isActive: true },

  // ── Kitchen Appliances ──
  { name: "KitchenAid Artisan Stand Mixer", description: "Iconic tilt-head stand mixer with 5-quart capacity, 10 speeds, and planetary mixing action.", price: 449, category: "Kitchen Appliances", stock: 25, images: ["https://images.unsplash.com/photo-1594385208974-2f8bb07b7a45?w=640&q=80"], isActive: true },
  { name: "Ninja Foodi 9-in-1 Pressure Cooker", description: "Multi-functional cooker combining pressure cooking, air frying, slow cooking, and steaming.", price: 249, category: "Kitchen Appliances", stock: 40, images: ["https://images.unsplash.com/photo-1585515320310-259814833e62?w=640&q=80"], isActive: true },
  { name: "Breville Barista Express Espresso", description: "Semi-automatic espresso machine with integrated grinder, precise temperature control, and steam wand.", price: 699, category: "Kitchen Appliances", stock: 20, images: ["https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=640&q=80"], isActive: true },

  // ── Fashion (Men) ──
  { name: "Levi's 501 Original Fit Jeans", description: "Classic straight-leg jeans crafted from premium denim with signature button fly and iconic styling.", price: 69, category: "Fashion (Men)", stock: 100, images: ["https://images.unsplash.com/photo-1542272604-787c3835535d?w=640&q=80"], isActive: true },
  { name: "Nike Dri-FIT Running Jacket", description: "Lightweight running jacket with moisture-wicking Dri-FIT technology and reflective details for visibility.", price: 89, category: "Fashion (Men)", stock: 80, images: ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=640&q=80"], isActive: true },
  { name: "Ralph Lauren Oxford Shirt", description: "Classic-fit cotton oxford shirt with button-down collar and embroidered pony logo for timeless style.", price: 110, category: "Fashion (Men)", stock: 70, images: ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=640&q=80"], isActive: true },

  // ── Fashion (Women) ──
  { name: "Zara Satin Midi Dress", description: "Elegant satin midi dress with V-neckline, adjustable straps, and flowing silhouette for any occasion.", price: 79, category: "Fashion (Women)", stock: 60, images: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=640&q=80"], isActive: true },
  { name: "Lululemon Align High-Rise Leggings", description: "Buttery-soft Nulu fabric leggings with high-rise waistband for yoga, running, and everyday comfort.", price: 98, category: "Fashion (Women)", stock: 90, images: ["https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=640&q=80"], isActive: true },
  { name: "Coach Tabby Shoulder Bag", description: "Signature leather shoulder bag with quilted design, brass hardware, and adjustable chain strap.", price: 395, category: "Fashion (Women)", stock: 30, images: ["https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=640&q=80"], isActive: true },

  // ── Footwear ──
  { name: "Nike Air Max 90", description: "Iconic sneakers with visible Air cushioning, waffle outsole, and timeless color-blocked design.", price: 130, category: "Footwear", stock: 85, images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=640&q=80"], isActive: true },
  { name: "Adidas Ultraboost 23", description: "Premium running shoes with Boost midsole technology, Primeknit upper, and Continental rubber outsole.", price: 190, category: "Footwear", stock: 70, images: ["https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=640&q=80"], isActive: true },
  { name: "Timberland 6-Inch Premium Boots", description: "Waterproof leather boots with padded collar, anti-fatigue technology, and rugged lug outsole.", price: 198, category: "Footwear", stock: 45, images: ["https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=640&q=80"], isActive: true },

  // ── Accessories ──
  { name: "Ray-Ban Aviator Classic", description: "Timeless aviator sunglasses with gold metal frame, crystal green G-15 lenses, and UV protection.", price: 163, category: "Accessories", stock: 55, images: ["https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=640&q=80"], isActive: true },
  { name: "Herschel Retreat Backpack", description: "Classic backpack with magnetic strap closures, 15-inch laptop sleeve, and signature striped liner.", price: 89, category: "Accessories", stock: 65, images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=640&q=80"], isActive: true },
  { name: "Daniel Wellington Classic Petite Watch", description: "Minimalist watch with slim case, interchangeable mesh strap, and Japanese quartz movement.", price: 189, category: "Accessories", stock: 40, images: ["https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=640&q=80"], isActive: true },

  // ── Furniture ──
  { name: "Herman Miller Aeron Chair", description: "Ergonomic office chair with PostureFit SL support, 8Z Pellicle mesh, and adjustable armrests.", price: 1395, category: "Furniture", stock: 12, images: ["https://images.unsplash.com/photo-1592078615290-033ee584e267?w=640&q=80"], isActive: true },
  { name: "IKEA KALLAX Shelf Unit", description: "Versatile shelving unit with clean lines, perfect for books, decor, and storage inserts.", price: 69, category: "Furniture", stock: 50, images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=640&q=80"], isActive: true },
  { name: "West Elm Mid-Century Nightstand", description: "Solid wood nightstand with tapered legs, spacious drawer, and open shelf for modern bedrooms.", price: 349, category: "Furniture", stock: 20, images: ["https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=640&q=80"], isActive: true },

  // ── Books ──
  { name: "Atomic Habits by James Clear", description: "Bestselling guide to building good habits and breaking bad ones through tiny changes with remarkable results.", price: 16, category: "Books", stock: 200, images: ["https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=640&q=80"], isActive: true },
  { name: "The Pragmatic Programmer", description: "Essential handbook for software developers covering best practices, career tips, and coding philosophy.", price: 49, category: "Books", stock: 120, images: ["https://images.unsplash.com/photo-1532012197267-da84d127e765?w=640&q=80"], isActive: true },
  { name: "Sapiens by Yuval Noah Harari", description: "A brief history of humankind exploring how Homo sapiens came to dominate the Earth and shape civilization.", price: 18, category: "Books", stock: 150, images: ["https://images.unsplash.com/photo-1512820790803-83ca734da794?w=640&q=80"], isActive: true },

  // ── Beauty & Personal Care ──
  { name: "Dyson Airwrap Multi-Styler", description: "Revolutionary hair styling tool using Coanda airflow to curl, wave, smooth, and dry without extreme heat.", price: 599, category: "Beauty & Personal Care", stock: 25, images: ["https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=640&q=80"], isActive: true },
  { name: "La Mer Moisturizing Cream", description: "Luxury moisturizer with Miracle Broth that helps heal dryness and deliver renewed radiance.", price: 190, category: "Beauty & Personal Care", stock: 35, images: ["https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=640&q=80"], isActive: true },
  { name: "Philips Norelco 9000 Prestige Shaver", description: "Premium electric shaver with dual SteelPrecision blades, contour-following heads, and Qi charging pad.", price: 249, category: "Beauty & Personal Care", stock: 40, images: ["https://images.unsplash.com/photo-1585751119414-ef2636f8aede?w=640&q=80"], isActive: true },

  // ── Sports & Fitness ──
  { name: "Peloton Bike+", description: "Interactive indoor cycling bike with 23.8-inch rotating touchscreen, auto-follow resistance, and live classes.", price: 2495, category: "Sports & Fitness", stock: 10, images: ["https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=640&q=80"], isActive: true },
  { name: "Bowflex SelectTech 552 Dumbbells", description: "Adjustable dumbbells replacing 15 sets of weights, adjusting from 5 to 52.5 lbs with a simple dial turn.", price: 429, category: "Sports & Fitness", stock: 30, images: ["https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=640&q=80"], isActive: true },
  { name: "Manduka PRO Yoga Mat", description: "Professional-grade yoga mat with dense cushioning, closed-cell surface, and lifetime guarantee.", price: 120, category: "Sports & Fitness", stock: 55, images: ["https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=640&q=80"], isActive: true },

  // ── Office Supplies ──
  { name: "Logitech MX Master 3S Mouse", description: "Advanced wireless mouse with MagSpeed scroll, ergonomic design, and multi-device connectivity.", price: 99, category: "Office Supplies", stock: 70, images: ["https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=640&q=80"], isActive: true },
  { name: "LG UltraWide 34WN80C Monitor", description: "34-inch curved ultrawide monitor with USB-C connectivity, HDR10, and sRGB 99% color accuracy.", price: 599, category: "Office Supplies", stock: 20, images: ["https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=640&q=80"], isActive: true },
  { name: "Autonomous ErgoChair Pro", description: "Fully adjustable ergonomic office chair with lumbar support, breathable mesh, and recline function.", price: 499, category: "Office Supplies", stock: 25, images: ["https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=640&q=80"], isActive: true },
];

module.exports = products;
