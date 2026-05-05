/**
 * vendorOnly — Middleware that restricts access to vendor-role users.
 * Must be used AFTER the `protect` middleware (requires req.user).
 */
const vendorOnly = (req, res, next) => {
  if (req.user.role !== "vendor") {
    return res.status(403).json({
      success: false,
      message: "Vendor access only",
    });
  }
  next();
};

module.exports = { vendorOnly };
