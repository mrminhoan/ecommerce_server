"use strict";
const express = require("express");
const accessController = require("../../controllers/access.controller");
const { apiKey, checkPermission } = require("../../auth/checkAuth");
const router = express.Router();

// Check api key
router.use(apiKey);

// Check permission key api
router.use(checkPermission("0000"));

router.use("/v1/api", require("../access"));

module.exports = router;
