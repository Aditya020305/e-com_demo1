const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.post("/register", asyncHandler(registerUser));
router.post("/login", asyncHandler(loginUser));

module.exports = router;
