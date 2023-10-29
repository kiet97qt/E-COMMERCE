"use strict";

const express = require("express");
const uploadController = require("../../controllers/upload.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { uploadDisk } = require("../../configs/multer.config");
// const { authentication } = require("../../auth/authUtils");
const router = express.Router();

router.post("/product", asyncHandler(uploadController.uploadFile));
router.post(
  "/product/thumb",
  uploadDisk.single("file"),
  asyncHandler(uploadController.uploadFileThumb)
);
router.post(
  "/product/multiple",
  uploadDisk.array("files", 3),
  asyncHandler(uploadController.uploadImageFromLocalFiles)
);

//authentication
// router.use(authentication);

module.exports = router;
