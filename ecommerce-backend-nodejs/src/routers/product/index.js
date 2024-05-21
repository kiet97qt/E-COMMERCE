"use strict";

const express = require("express");
const productController = require("../../controllers/product.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const router = express.Router();

router.get(
  "/search/:keySearch",
  asyncHandler(productController.getListSearchProduct)
);

router.get("/sku/select_variation", asyncHandler(productController.findOneSku));
router.get("/spu/get_spu_info", asyncHandler(productController.findOneSpu));
router.get("/", asyncHandler(productController.findAllProducts));
router.get("/:product_id", asyncHandler(productController.findProduct));

//authentication
router.use(authentication);
router.post("/", asyncHandler(productController.createProduct));
router.post("/spu/new", asyncHandler(productController.createSpu));

router.patch("/:productId", asyncHandler(productController.updateProduct));

router.post(
  "/publish/:id",
  asyncHandler(productController.publishProductByShop)
);
router.post(
  "/unpublish/:id",
  asyncHandler(productController.unPublishProductByShop)
);

router.get("/drafts/all", asyncHandler(productController.getAllDraftsForShop));
router.get(
  "/published/all",
  asyncHandler(productController.getAllPublishForShop)
);

module.exports = router;
