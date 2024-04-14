"use strict";

const express = require("express");
const rbacController = require("../../controllers/rbac.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const router = express.Router();

//get amount a discount
router.post("/role", asyncHandler(rbacController.newRole));
router.get("/roles", asyncHandler(rbacController.listRoles));
router.post("/resource", asyncHandler(rbacController.newResource));
router.get("/resources", asyncHandler(rbacController.listResources));

module.exports = router;
