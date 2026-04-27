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

const getProducts = async (req, res) => {
  const { keyword, category, page = 1, limit = 10 } = req.query;

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));

  const filter = { isActive: true };

  if (keyword) {
    filter.$text = { $search: keyword };
  }

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
