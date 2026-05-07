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
const upload = require("../middleware/upload");

const router = express.Router();

router
  .route("/")
  .get(asyncHandler(getProducts))
  .post(protect, upload.array("media", 10), asyncHandler(createProduct));

// Vendor-specific: must be BEFORE /:id to avoid "vendor" being parsed as an id
router.get("/vendor", protect, vendorOnly, asyncHandler(getVendorProducts));

// Dedicated media upload endpoint
router.post(
  "/upload",
  protect,
  vendorOnly,
  upload.array("media", 10),
  (req, res) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "No files uploaded" });
    }
    const urls = req.files.map(
      (file) => `/uploads/products/${file.filename}`
    );
    res.json({ success: true, data: urls });
  }
);

router
  .route("/:id")
  .get(asyncHandler(getProductById))
  .put(protect, upload.array("media", 10), asyncHandler(updateProduct))
  .delete(protect, asyncHandler(deleteProduct));

module.exports = router;
