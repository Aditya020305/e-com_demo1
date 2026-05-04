/**
 * Database Seeder Script
 * ─────────────────────────────────────────────
 * Seeds the MongoDB database with realistic product data.
 *
 * Usage:
 *   npm run data:import          → Seed products
 *   npm run data:import -- -d    → Delete all products
 *
 * SAFETY:
 *   - Creates a dedicated seed vendor if none exists
 *   - Only deletes Products collection (NOT users, carts, orders)
 *   - Logs every step for audit trail
 */

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

// Load env from server directory regardless of where script is run
dotenv.config({ path: path.join(__dirname, ".env") });

const Product = require("./models/Product");
const User = require("./models/User");
const products = require("./data/products");

const SEED_VENDOR_EMAIL = "seedvendor@ecomstore.com";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

/**
 * Get or create a vendor user for seeded products
 */
const getOrCreateVendor = async () => {
  let vendor = await User.findOne({ email: SEED_VENDOR_EMAIL });

  if (!vendor) {
    console.log("🔧 Creating seed vendor account...");
    vendor = await User.create({
      name: "EcomStore Official",
      email: SEED_VENDOR_EMAIL,
      password: "SeedVendor@2024",
      role: "vendor",
      isActive: true,
    });
    console.log(`✅ Seed vendor created: ${vendor._id}`);
  } else {
    console.log(`✅ Using existing vendor: ${vendor._id}`);
  }

  return vendor;
};

/**
 * Import seed data into the database
 */
const importData = async () => {
  try {
    await connectDB();

    const vendor = await getOrCreateVendor();

    // Delete existing products from seed vendor only (safe — preserves other vendors' products)
    const deleteResult = await Product.deleteMany({ vendor: vendor._id });
    console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing seed products`);

    // Attach vendor ID to all products
    const productsWithVendor = products.map((p) => ({
      ...p,
      vendor: vendor._id,
    }));

    const inserted = await Product.insertMany(productsWithVendor);

    console.log(`\n🎉 Successfully seeded ${inserted.length} products!`);
    console.log(`📦 Categories: ${[...new Set(inserted.map((p) => p.category))].length}`);
    console.log(`\n── Category Breakdown ──`);

    const categories = {};
    inserted.forEach((p) => {
      categories[p.category] = (categories[p.category] || 0) + 1;
    });
    Object.entries(categories)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .forEach(([cat, count]) => {
        console.log(`   ${cat}: ${count} products`);
      });

    console.log(`\n✅ Seeding complete. All products have isActive: true`);
    console.log(`✅ Vendor ID: ${vendor._id}`);

    // Quick validation
    const total = await Product.countDocuments({ isActive: true });
    console.log(`✅ Total active products in DB: ${total}`);

    process.exit(0);
  } catch (error) {
    console.error(`\n❌ Seeding failed: ${error.message}`);
    if (error.errors) {
      Object.entries(error.errors).forEach(([field, err]) => {
        console.error(`   → ${field}: ${err.message}`);
      });
    }
    process.exit(1);
  }
};

/**
 * Delete seed data only (safe — does NOT touch orders, carts, or other vendor products)
 */
const deleteData = async () => {
  try {
    await connectDB();

    const vendor = await User.findOne({ email: SEED_VENDOR_EMAIL });

    if (!vendor) {
      console.log("⚠️  No seed vendor found. Nothing to delete.");
      process.exit(0);
    }

    const result = await Product.deleteMany({ vendor: vendor._id });
    console.log(`🗑️  Deleted ${result.deletedCount} seed products`);
    console.log(`✅ Cleanup complete. Other data is untouched.`);

    process.exit(0);
  } catch (error) {
    console.error(`❌ Delete failed: ${error.message}`);
    process.exit(1);
  }
};

// CLI argument handling
if (process.argv[2] === "-d" || process.argv[2] === "--delete") {
  deleteData();
} else {
  importData();
}
