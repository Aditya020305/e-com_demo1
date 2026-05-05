const express = require("express");
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getVendorProducts,
} = require("../controllers/productController");
const { protect } = require("../middleware/authMiddleware");
const { vendorOnly } = require("../middleware/vendorOnly");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router
  .route("/")
  .get(asyncHandler(getProducts))
  .post(protect, asyncHandler(createProduct));

// Vendor-specific: must be BEFORE /:id to avoid "vendor" being parsed as an id
router.get("/vendor", protect, vendorOnly, asyncHandler(getVendorProducts));

router
  .route("/:id")
  .get(asyncHandler(getProductById))
  .put(protect, asyncHandler(updateProduct))
  .delete(protect, asyncHandler(deleteProduct));

module.exports = router;
