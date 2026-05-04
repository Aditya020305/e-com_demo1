const mongoose = require("mongoose");
const Product = require("../models/Product");

const createProduct = async (req, res) => {
  if (req.user.role !== "vendor") {
    res.status(403);
    throw new Error("Only vendors can create products");
  }

  const { name, description, price, category, stock, images } = req.body;

  if (!name || !description || price === undefined || !category) {
    res.status(400);
    throw new Error("Please provide name, description, price, and category");
  }

  const product = await Product.create({
    name,
    description,
    price,
    category,
    stock: stock || 0,
    images: images || [],
    vendor: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: product,
  });
};

/* ── Smart Search: Intent Detection Maps ── */
const PRICE_INTENTS = [
  { keywords: ["cheap", "budget", "low", "affordable", "inexpensive", "value"], filter: { price: { $lt: 200 } }, label: "budget" },
  { keywords: ["mid", "standard", "moderate", "average", "mid-range", "midrange"], filter: { price: { $gte: 200, $lte: 1000 } }, label: "mid-range" },
  { keywords: ["premium", "expensive", "luxury", "high-end", "highend", "pro", "flagship"], filter: { price: { $gt: 1000 } }, label: "premium" },
];

const CATEGORY_INTENTS = [
  { keywords: ["phone", "mobile", "smartphone", "iphone", "android", "samsung", "pixel"], category: "Mobile Phones" },
  { keywords: ["laptop", "notebook", "macbook", "thinkpad", "ultrabook"], category: "Laptops" },
  { keywords: ["tablet", "ipad", "surface"], category: "Tablets" },
  { keywords: ["headphone", "headphones", "earbuds", "earphone", "speaker", "audio", "airpods", "earbud"], category: "Audio" },
  { keywords: ["watch", "smartwatch", "wearable", "fitbit", "fitness band", "tracker"], category: "Wearables" },
  { keywords: ["camera", "gopro", "dslr", "mirrorless", "photography"], category: "Cameras" },
  { keywords: ["gaming", "console", "playstation", "xbox", "nintendo", "controller", "gamepad"], category: "Gaming" },
  { keywords: ["appliance", "vacuum", "tv", "television", "robot"], category: "Home Appliances" },
  { keywords: ["kitchen", "mixer", "blender", "cooker", "espresso", "coffee"], category: "Kitchen Appliances" },
  { keywords: ["men", "menswear", "jacket", "shirt", "jeans"], category: "Fashion (Men)" },
  { keywords: ["women", "womenswear", "dress", "legging", "leggings", "handbag", "purse"], category: "Fashion (Women)" },
  { keywords: ["shoe", "shoes", "sneaker", "sneakers", "boots", "footwear", "running shoe"], category: "Footwear" },
  { keywords: ["accessory", "accessories", "sunglasses", "backpack", "bag", "wallet"], category: "Accessories" },
  { keywords: ["furniture", "chair", "desk", "shelf", "table", "nightstand", "sofa"], category: "Furniture" },
  { keywords: ["book", "books", "novel", "reading"], category: "Books" },
  { keywords: ["beauty", "skincare", "makeup", "shaver", "hair", "cosmetic", "moisturizer"], category: "Beauty & Personal Care" },
  { keywords: ["sport", "sports", "fitness", "gym", "yoga", "dumbbell", "bike", "cycling", "workout"], category: "Sports & Fitness" },
  { keywords: ["office", "mouse", "monitor", "keyboard", "stationery", "ergonomic"], category: "Office Supplies" },
];

/**
 * parseSmartKeyword — Extracts price intent, category intent, and remaining
 * text search terms from a natural-language keyword string.
 * Returns { priceFilter, detectedCategory, searchTerms, labels }
 */
const parseSmartKeyword = (keyword) => {
  const words = keyword.toLowerCase().split(/\s+/);
  let priceFilter = null;
  let detectedCategory = null;
  const remainingWords = [];
  const labels = [];

  for (const word of words) {
    let matched = false;

    // Check price intent
    for (const intent of PRICE_INTENTS) {
      if (intent.keywords.includes(word)) {
        priceFilter = intent.filter;
        labels.push(intent.label);
        matched = true;
        break;
      }
    }

    // Check category intent
    if (!matched) {
      for (const intent of CATEGORY_INTENTS) {
        if (intent.keywords.includes(word)) {
          detectedCategory = intent.category;
          labels.push(intent.category);
          matched = true;
          break;
        }
      }
    }

    // Keep unmatched words for text search
    if (!matched) {
      remainingWords.push(word);
    }
  }

  return {
    priceFilter,
    detectedCategory,
    searchTerms: remainingWords.join(" ").trim(),
    labels,
  };
};

const getProducts = async (req, res) => {
  const { keyword, category, page = 1, limit = 10 } = req.query;

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));

  const filter = { isActive: true };
  let searchInterpretation = null;

  if (keyword) {
    const parsed = parseSmartKeyword(keyword);

    // Apply detected category (only if no explicit category query param)
    if (parsed.detectedCategory && !category) {
      filter.category = parsed.detectedCategory;
    }

    // Apply price filter
    if (parsed.priceFilter) {
      Object.assign(filter, parsed.priceFilter);
    }

    // Apply text search only on remaining unmatched terms
    if (parsed.searchTerms) {
      filter.$or = [
        { name: { $regex: parsed.searchTerms, $options: "i" } },
        { description: { $regex: parsed.searchTerms, $options: "i" } },
      ];
    } else if (!parsed.detectedCategory && !parsed.priceFilter) {
      // No intents matched at all — fallback to full keyword regex
      filter.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];
    }

    // Build interpretation label for frontend
    if (parsed.labels.length > 0) {
      searchInterpretation = parsed.labels.join(" · ");
    }
  }

  // Explicit category param always takes priority
  if (category) {
    filter.category = category;
  }

  const total = await Product.countDocuments(filter);
  const totalPages = Math.ceil(total / limitNum);
  const skip = (pageNum - 1) * limitNum;

  const products = await Product.find(filter)
    .populate("vendor", "name email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  res.json({
    success: true,
    message: "Products fetched successfully",
    data: {
      products,
      total,
      page: pageNum,
      totalPages,
      ...(searchInterpretation && { searchInterpretation }),
    },
  });
};

const getProductById = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error("Invalid product ID");
  }

  const product = await Product.findOne({
    _id: req.params.id,
    isActive: true,
  }).populate("vendor", "name email");

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.json({
    success: true,
    message: "Product fetched successfully",
    data: product,
  });
};

const updateProduct = async (req, res) => {
  if (req.user.role !== "vendor") {
    res.status(403);
    throw new Error("Only vendors can update products");
  }

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error("Invalid product ID");
  }

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (product.vendor.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to update this product");
  }

  const allowedFields = ["name", "description", "price", "category", "stock", "images"];
  const updates = {};

  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    updates,
    { new: true, runValidators: true }
  ).populate("vendor", "name email");

  res.json({
    success: true,
    message: "Product updated successfully",
    data: updatedProduct,
  });
};

const deleteProduct = async (req, res) => {
  if (req.user.role !== "vendor") {
    res.status(403);
    throw new Error("Only vendors can delete products");
  }

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error("Invalid product ID");
  }

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (product.vendor.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to delete this product");
  }

  product.isActive = false;
  await product.save();

  res.json({
    success: true,
    message: "Product deleted successfully",
  });
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
