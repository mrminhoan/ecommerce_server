"use strict";
const express = require("express");
const accessController = require("../../controllers/access.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authenticationV2 } = require("../../auth/authUtils");
const router = express.Router();
// Sign Up
router.post("/shop/signup", asyncHandler(accessController.signUp));
// Sign In
router.post("/shop/signin", asyncHandler(accessController.signIn));

// Authentication
router.use(authenticationV2);
///////////////////////////////////////////////////////////

// Sign Out
router.post("/shop/signout", asyncHandler(accessController.signOut));

// Refresh Token
router.post(
  "/shop/refreshToken",
  asyncHandler(accessController.handleRefreshToken)
);

module.exports = router;
