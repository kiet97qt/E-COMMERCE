"use strict";

const { SuccessResponse } = require("../core/success.response");
const ProductService = require("../services/product.service");
const { oneSku } = require("../services/sku.service");
const { oneSpu } = require("../services/spu.service");

class ProductController {
  findOneSpu = async (req, res, next) => {
    const { product_id } = req.query;
    new SuccessResponse({
      message: "product one",
      metadata: await oneSpu({ spu_id: product_id }),
    }).send(res);
  };

  findOneSku = async (req, res, next) => {
    const { sku_id, product_id } = req.query;
    new SuccessResponse({
      message: "get one sku",
      metadata: await oneSku({ sku_id, product_id }),
    }).send(res);
  };

  createSpu = async (req, res, next) => {
    const spu = await newSpu({
      ...req.body,
      product_shop: req.user.userId,
    });

    new SuccessResponse({
      message: "Success  create spu",
      metadata: spu,
    }).send(res);
  };

  createProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Create new Product success!",
      metadata: await ProductService.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  updateProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Update Product success!",
      metadata: await ProductService.updateProduct(
        req.body.product_type,
        req.params.productId,
        {
          ...req.body,
        }
      ),
    }).send(res);
  };

  publishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "publishProductByShop success!",
      metadata: await ProductService.publishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  unPublishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "unPublishProductByShop success!",
      metadata: await ProductService.unPublishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  getAllDraftsForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list Draft success!",
      metadata: await ProductService.findAllDraftsForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  getAllPublishForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list Published success!",
      metadata: await ProductService.findAllPublishForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  getListSearchProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list Published success!",
      metadata: await ProductService.searchProducts(req.params),
    }).send(res);
  };

  findAllProducts = async (req, res, next) => {
    new SuccessResponse({
      message: "findAllProducts success!",
      metadata: await ProductService.findAllProducts(req.query),
    }).send(res);
  };

  findProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "findProduct success!",
      metadata: await ProductService.findProduct({
        product_id: req.params.product_id,
      }),
    }).send(res);
  };
}

module.exports = new ProductController();
