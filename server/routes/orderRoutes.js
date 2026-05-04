const express = require("express");
const {
  createOrder,
  getMyOrders,
  getOrderById,
  returnOrder,
} = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.post("/", protect, asyncHandler(createOrder));
router.get("/my", protect, asyncHandler(getMyOrders));
router.get("/:id", protect, asyncHandler(getOrderById));
router.post("/:id/return", protect, asyncHandler(returnOrder));

module.exports = router;
