const express = require("express");
const { getRecommendations } = require("../controllers/recommendationController");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

// GET /api/products/:id/recommendations
router.get("/:id/recommendations", asyncHandler(getRecommendations));

module.exports = router;
