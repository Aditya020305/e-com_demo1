const express = require("express");
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { protect } = require("../middleware/authMiddleware");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router
  .route("/")
  .get(asyncHandler(getProducts))
  .post(protect, asyncHandler(createProduct));

router
  .route("/:id")
  .get(asyncHandler(getProductById))
  .put(protect, asyncHandler(updateProduct))
  .delete(protect, asyncHandler(deleteProduct));

module.exports = router;
