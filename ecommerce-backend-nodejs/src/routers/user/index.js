"use strict";

const express = require("express");
const {
  newUser,
  checkLoginEmailToken,
} = require("../../controllers/user.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const router = express.Router();

router.post("/new_user", asyncHandler(newUser));
router.post("/welcome-back", asyncHandler(checkLoginEmailToken));

module.exports = router;
