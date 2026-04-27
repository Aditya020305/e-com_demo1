const express = require("express");
const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
} = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router
  .route("/")
  .get(protect, asyncHandler(getCart))
  .post(protect, asyncHandler(addToCart))
  .put(protect, asyncHandler(updateCartItem));

router
  .route("/:productId")
  .delete(protect, asyncHandler(removeCartItem));

module.exports = router;
