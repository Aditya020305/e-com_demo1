const express = require("express");
const {
  createOrder,
  getMyOrders,
  getOrderById,
  returnOrder,
  getVendorOrders,
} = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");
const { vendorOnly } = require("../middleware/vendorOnly");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.post("/", protect, asyncHandler(createOrder));
router.get("/my", protect, asyncHandler(getMyOrders));

// Vendor-specific: must be BEFORE /:id to avoid "vendor" being parsed as an id
router.get("/vendor", protect, vendorOnly, asyncHandler(getVendorOrders));

router.get("/:id", protect, asyncHandler(getOrderById));
router.post("/:id/return", protect, asyncHandler(returnOrder));

module.exports = router;
