/**
 * Fraud Detection Utility
 * ─────────────────────────────────────────────
 * Rule-based fraud detection for users and vendors.
 *
 * USER RULE:
 *   If totalOrders >= 5 AND returnedOrders/totalOrders > 60% → block user
 *
 * VENDOR RULE:
 *   If totalOrders >= 5 AND failedOrders/totalOrders > 40% → suspend vendor
 */

/**
 * Check and update fraud status for a user.
 * Returns { blocked: boolean, reason?: string }
 */
const checkUserFraud = async (user) => {
  if (user.isBlocked) {
    return { blocked: true, reason: "User blocked due to suspicious activity" };
  }

  if (user.totalOrders >= 5) {
    const returnRate = user.returnedOrders / user.totalOrders;
    if (returnRate > 0.6) {
      user.isBlocked = true;
      await user.save();
      return { blocked: true, reason: "User blocked due to suspicious activity" };
    }
  }

  return { blocked: false };
};

/**
 * Check and update fraud status for a vendor.
 * Returns { suspended: boolean, reason?: string }
 */
const checkVendorFraud = async (vendor) => {
  if (vendor.isSuspended) {
    return { suspended: true, reason: "Vendor temporarily suspended" };
  }

  if (vendor.totalOrders >= 5) {
    const failRate = vendor.failedOrders / vendor.totalOrders;
    if (failRate > 0.4) {
      vendor.isSuspended = true;
      await vendor.save();
      return { suspended: true, reason: "Vendor temporarily suspended" };
    }
  }

  return { suspended: false };
};

module.exports = { checkUserFraud, checkVendorFraud };
