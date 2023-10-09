"use strict";

const express = require("express");
const checkoutController = require("../../controllers/checkout.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const router = express.Router();

//get amount a discount
router.post("/review", asyncHandler(checkoutController.checkoutReview));

module.exports = router;
