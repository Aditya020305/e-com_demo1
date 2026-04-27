const mongoose = require("mongoose");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const populateCart = (query) => {
  return query.populate("items.product", "name price images category stock isActive");
};

const getCart = async (req, res) => {
  let cart = await populateCart(Cart.findOne({ user: req.user._id }));

  if (!cart) {
    return res.json({
      success: true,
      message: "Cart is empty",
      data: { user: req.user._id, items: [] },
    });
  }

  res.json({
    success: true,
    message: "Cart fetched successfully",
    data: cart,
  });
};

const addToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  if (!productId) {
    res.status(400);
    throw new Error("Product ID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    res.status(400);
    throw new Error("Invalid product ID");
  }

  if (!Number.isInteger(quantity) || quantity < 1) {
    res.status(400);
    throw new Error("Quantity must be a positive integer");
  }

  const product = await Product.findById(productId);

  if (!product || !product.isActive) {
    res.status(404);
    throw new Error("Product not found or unavailable");
  }

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = new Cart({ user: req.user._id, items: [] });
  }

  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity });
  }

  await cart.save();

  const populatedCart = await populateCart(Cart.findById(cart._id));

  res.status(201).json({
    success: true,
    message: "Item added to cart",
    data: populatedCart,
  });
};

const updateCartItem = async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId) {
    res.status(400);
    throw new Error("Product ID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    res.status(400);
    throw new Error("Invalid product ID");
  }

  if (quantity === undefined || quantity === null) {
    res.status(400);
    throw new Error("Quantity is required");
  }

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (itemIndex === -1) {
    res.status(404);
    throw new Error("Item not found in cart");
  }

  if (quantity <= 0) {
    cart.items.splice(itemIndex, 1);
  } else {
    cart.items[itemIndex].quantity = quantity;
  }

  await cart.save();

  const populatedCart = await populateCart(Cart.findById(cart._id));

  res.json({
    success: true,
    message: quantity <= 0 ? "Item removed from cart" : "Cart updated",
    data: populatedCart,
  });
};

const removeCartItem = async (req, res) => {
  const { productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    res.status(400);
    throw new Error("Invalid product ID");
  }

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  const originalLength = cart.items.length;

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId
  );

  if (cart.items.length === originalLength) {
    res.status(404);
    throw new Error("Item not found in cart");
  }

  await cart.save();

  const populatedCart = await populateCart(Cart.findById(cart._id));

  res.json({
    success: true,
    message: "Item removed from cart",
    data: populatedCart,
  });
};

module.exports = { getCart, addToCart, updateCartItem, removeCartItem };
