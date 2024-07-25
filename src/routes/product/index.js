"use strict";
const express = require("express");
const productionController = require("../../controllers/production.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authenticationV2 } = require("../../auth/authUtils");
const router = express.Router();

router.get(
  "/search/:keyword",
  asyncHandler(productionController.searchProductByUser)
);

// Authentication
router.use(authenticationV2);
///////////////////////////////////////////////////////////
router.post("", asyncHandler(productionController.createProduct));

router.post(
  "/publish-drafts/:id",
  asyncHandler(productionController.publishDraftsForShop)
);
router.post(
  "/un-publish-product/:id",
  asyncHandler(productionController.unPublishProductForShop)
);

// QUERY
router.get(
  "/drafts/all",
  asyncHandler(productionController.getAllDraftsForShop)
);
router.get(
  "/published/all",
  asyncHandler(productionController.getAllPublishedForShop)
);

module.exports = router;
