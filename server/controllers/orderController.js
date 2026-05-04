const mongoose = require("mongoose");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const User = require("../models/User");
const { checkUserFraud, checkVendorFraud } = require("../utils/fraudCheck");

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

  /* ── Fraud Check: Is user blocked? ── */
  const user = await User.findById(req.user._id);
  const userCheck = await checkUserFraud(user);
  if (userCheck.blocked) {
    res.status(403);
    throw new Error(userCheck.reason);
  }

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error("Cart is empty, cannot place order");
  }

  const orderItems = [];
  let totalPrice = 0;
  const vendorIds = new Set();

  for (const item of cart.items) {
    const product = await Product.findById(item.product);

    if (!product || !product.isActive) {
      res.status(400);
      throw new Error(`Product ${item.product} is no longer available`);
    }

    /* ── Fraud Check: Is vendor suspended? ── */
    const vendor = await User.findById(product.vendor);
    if (vendor) {
      const vendorCheck = await checkVendorFraud(vendor);
      if (vendorCheck.suspended) {
        res.status(403);
        throw new Error(`${vendorCheck.reason} — product "${product.name}" is currently unavailable`);
      }
      vendorIds.add(product.vendor.toString());
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

  /* ── Increment order counters ── */
  await User.findByIdAndUpdate(req.user._id, { $inc: { totalOrders: 1 } });

  // Increment totalOrders for each unique vendor involved
  for (const vendorId of vendorIds) {
    await User.findByIdAndUpdate(vendorId, { $inc: { totalOrders: 1 } });
  }

  res.status(201).json({
    success: true,
    message: "Order placed successfully",
    data: order,
  });
};

/**
 * Simulate a return / complaint on an order.
 * POST /api/orders/:id/return
 * Body: { reason?: string, vendorComplaint?: boolean }
 */
const returnOrder = async (req, res) => {
  const { vendorComplaint } = req.body;

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error("Invalid order ID");
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (order.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to return this order");
  }

  if (order.isReturned) {
    res.status(400);
    throw new Error("Order already returned");
  }

  // Mark order as returned
  order.isReturned = true;
  await order.save();

  // Increment user's return counter
  await User.findByIdAndUpdate(req.user._id, { $inc: { returnedOrders: 1 } });

  // If vendor complaint, increment vendor's failed order counter
  if (vendorComplaint) {
    const productIds = order.orderItems.map((item) => item.product);
    const products = await Product.find({ _id: { $in: productIds } });
    const vendorIds = new Set(products.map((p) => p.vendor.toString()));

    for (const vendorId of vendorIds) {
      await User.findByIdAndUpdate(vendorId, { $inc: { failedOrders: 1 } });
    }
  }

  // Re-check fraud status
  const user = await User.findById(req.user._id);
  await checkUserFraud(user);

  res.json({
    success: true,
    message: "Order returned successfully",
    data: { orderId: order._id, isReturned: true },
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

module.exports = { createOrder, getMyOrders, getOrderById, returnOrder };

