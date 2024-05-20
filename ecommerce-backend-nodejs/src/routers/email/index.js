"use strict";

const express = require("express");
const { newTemplate } = require("../../controllers/email.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const router = express.Router();

router.post("/new_template", asyncHandler(newTemplate));

module.exports = router;
