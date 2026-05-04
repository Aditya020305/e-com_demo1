const mongoose = require("mongoose");
const Product = require("../models/Product");

/**
 * GET /api/products/:id/recommendations
 * Returns 4–6 products from the same category, sorted by price proximity.
 */
const getRecommendations = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid product ID");
  }

  const currentProduct = await Product.findById(id);

  if (!currentProduct || !currentProduct.isActive) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Find products in the same category, excluding the current product
  const sameCategoryProducts = await Product.find({
    category: currentProduct.category,
    isActive: true,
    _id: { $ne: currentProduct._id },
  })
    .populate("vendor", "name email")
    .lean();

  // Sort by price proximity (closest price first)
  const sorted = sameCategoryProducts.sort(
    (a, b) =>
      Math.abs(a.price - currentProduct.price) -
      Math.abs(b.price - currentProduct.price)
  );

  // If same-category results are too few, backfill from other categories
  let recommendations = sorted.slice(0, 6);

  if (recommendations.length < 4) {
    const existingIds = [
      currentProduct._id,
      ...recommendations.map((p) => p._id),
    ];

    const backfill = await Product.find({
      isActive: true,
      _id: { $nin: existingIds },
    })
      .populate("vendor", "name email")
      .lean();

    const backfillSorted = backfill.sort(
      (a, b) =>
        Math.abs(a.price - currentProduct.price) -
        Math.abs(b.price - currentProduct.price)
    );

    recommendations = [
      ...recommendations,
      ...backfillSorted.slice(0, 6 - recommendations.length),
    ];
  }

  res.json({
    success: true,
    message: "Recommendations fetched successfully",
    data: recommendations,
  });
};

module.exports = { getRecommendations };
