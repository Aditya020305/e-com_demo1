const Product = require("../models/Product");
const Order = require("../models/Order");

/**
 * getVendorAnalytics — Returns aggregate stats for the logged-in vendor.
 * GET /api/vendor/analytics
 */
const getVendorAnalytics = async (req, res) => {
  const vendorId = req.user._id;

  // Total products owned by this vendor
  const totalProducts = await Product.countDocuments({ vendor: vendorId });

  // Get vendor product IDs for order filtering
  const vendorProductIds = await Product.find({ vendor: vendorId }).distinct("_id");
  const vendorProductIdStrings = vendorProductIds.map((id) => id.toString());

  // Orders containing at least one of this vendor's products
  const orders = await Order.find({
    "orderItems.product": { $in: vendorProductIds },
  })
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  const totalOrders = orders.length;

  // Calculate revenue from vendor's items only
  let totalRevenue = 0;
  for (const order of orders) {
    for (const item of order.orderItems) {
      if (vendorProductIdStrings.includes(item.product.toString())) {
        totalRevenue += item.price * item.quantity;
      }
    }
  }

  // Recent 5 orders (already sorted desc)
  const recentOrders = orders.slice(0, 5).map((order) => ({
    _id: order._id,
    user: order.user,
    totalPrice: order.totalPrice,
    isPaid: order.isPaid,
    isDelivered: order.isDelivered,
    isReturned: order.isReturned,
    createdAt: order.createdAt,
    itemCount: order.orderItems.filter((item) =>
      vendorProductIdStrings.includes(item.product.toString())
    ).length,
  }));

  res.json({
    success: true,
    message: "Vendor analytics fetched successfully",
    data: {
      totalProducts,
      totalOrders,
      totalRevenue,
      recentOrders,
    },
  });
};

module.exports = { getVendorAnalytics };
