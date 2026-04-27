const mongoose = require("mongoose");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const createOrder = async (req, res) => {
  const { shippingAddress, paymentMethod } = req.body;

  if (!shippingAddress || !shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.country) {
    res.status(400);
    throw new Error("Complete shipping address is required");
  }

  if (!paymentMethod) {
    res.status(400);
    throw new Error("Payment method is required");
  }

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error("Cart is empty, cannot place order");
  }

  const orderItems = [];
  let totalPrice = 0;

  for (const item of cart.items) {
    const product = await Product.findById(item.product);

    if (!product || !product.isActive) {
      res.status(400);
      throw new Error(`Product ${item.product} is no longer available`);
    }

    orderItems.push({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
    });

    totalPrice += product.price * item.quantity;
  }

  const order = await Order.create({
    user: req.user._id,
    orderItems,
    totalPrice,
    shippingAddress,
    paymentMethod,
  });

  cart.items = [];
  await cart.save();

  res.status(201).json({
    success: true,
    message: "Order placed successfully",
    data: order,
  });
};

const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

  res.json({
    success: true,
    message: "Orders fetched successfully",
    data: orders,
  });
};

const getOrderById = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error("Invalid order ID");
  }

  const order = await Order.findById(req.params.id).populate("user", "name email");

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (order.user._id.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to view this order");
  }

  res.json({
    success: true,
    message: "Order fetched successfully",
    data: order,
  });
};

module.exports = { createOrder, getMyOrders, getOrderById };
