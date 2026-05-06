// RAZORPAY INTEGRATION START
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * Create a Razorpay order for an existing order.
 * POST /api/payment/create-order
 * Body: { orderId }
 */
const createRazorpayOrder = async (req, res) => {
  const { orderId } = req.body;

  if (!orderId) {
    res.status(400);
    throw new Error("orderId is required");
  }

  const order = await Order.findById(orderId);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (order.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized");
  }

  if (order.isPaid) {
    res.status(400);
    throw new Error("Order is already paid");
  }

  // Amount in paise (Razorpay expects smallest currency unit)
  const amountInPaise = Math.round(order.totalPrice * 100);

  const razorpayOrder = await razorpayInstance.orders.create({
    amount: amountInPaise,
    currency: "INR",
    receipt: `order_${order._id}`,
    notes: {
      orderId: order._id.toString(),
    },
  });

  // Store Razorpay order ID on the order document
  order.razorpayOrderId = razorpayOrder.id;
  await order.save();

  res.json({
    success: true,
    data: {
      razorpayOrderId: razorpayOrder.id,
      amount: amountInPaise,
      currency: "INR",
      keyId: process.env.RAZORPAY_KEY_ID,
    },
  });
};

/**
 * Verify Razorpay payment signature and mark order as paid.
 * POST /api/payment/verify
 * Body: { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature }
 */
const verifyRazorpayPayment = async (req, res) => {
  const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!orderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    res.status(400);
    throw new Error("All payment fields are required");
  }

  // Verify signature using HMAC SHA256
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    res.status(400);
    throw new Error("Payment verification failed — invalid signature");
  }

  // Mark order as paid
  const order = await Order.findById(orderId);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (order.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized");
  }

  order.isPaid = true;
  order.paidAt = new Date();
  order.razorpayPaymentId = razorpay_payment_id;
  order.razorpaySignature = razorpay_signature;
  await order.save();

  res.json({
    success: true,
    message: "Payment verified successfully",
    data: {
      orderId: order._id,
      isPaid: true,
      paidAt: order.paidAt,
    },
  });
};

module.exports = { createRazorpayOrder, verifyRazorpayPayment };
// RAZORPAY INTEGRATION END
