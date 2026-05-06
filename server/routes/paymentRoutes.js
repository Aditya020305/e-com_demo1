// RAZORPAY INTEGRATION START
const express = require("express");
const {
  createRazorpayOrder,
  verifyRazorpayPayment,
} = require("../controllers/paymentController");
const { protect } = require("../middleware/authMiddleware");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.post("/create-order", protect, asyncHandler(createRazorpayOrder));
router.post("/verify", protect, asyncHandler(verifyRazorpayPayment));

module.exports = router;
// RAZORPAY INTEGRATION END
