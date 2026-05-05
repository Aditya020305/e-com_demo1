const express = require("express");
const { getVendorAnalytics } = require("../controllers/vendorController");
const { protect } = require("../middleware/authMiddleware");
const { vendorOnly } = require("../middleware/vendorOnly");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.get("/analytics", protect, vendorOnly, asyncHandler(getVendorAnalytics));

module.exports = router;
