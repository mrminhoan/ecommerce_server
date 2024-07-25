"use strict";
const express = require("express");
const productionController = require("../../controllers/production.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authenticationV2 } = require("../../auth/authUtils");
const router = express.Router();

// Authentication
router.use(authenticationV2);
///////////////////////////////////////////////////////////
// Sign Out
router.post("", asyncHandler(productionController.createProduct));

module.exports = router;
