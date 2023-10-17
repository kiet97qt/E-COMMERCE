"use strict";

const express = require("express");
const CommentController = require("../../controllers/comment.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const router = express.Router();

//authentication
router.use(authentication);
router.post("/", asyncHandler(CommentController.createComment));
router.get("/", asyncHandler(CommentController.getCommentsByParentId));

module.exports = router;
