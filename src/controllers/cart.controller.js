"use strict";

const { SuccessResponse } = require("../core/success.response");
const CartService = require("../services/cart.service");
class CartController {
  //new
  addToCart = async (req, res, next) => {
    new SuccessResponse({
      message: "Successful addToCart",
      metadata: await CartService.addToCart(req.body),
    }).send(res);
  };

  //update + -
  update = async (req, res, next) => {
    new SuccessResponse({
      message: "Successful update",
      metadata: await CartService.addToCartV2(req.body),
    }).send(res);
  };

  delete = async (req, res, next) => {
    new SuccessResponse({
      message: "Successful delete",
      metadata: await CartService.deleteUserCart(req.body),
    }).send(res);
  };

  listToCart = async (req, res, next) => {
    new SuccessResponse({
      message: "Successful listToCart",
      metadata: await CartService.getListUserCart(req.query),
    }).send(res);
  };
}

module.exports = new CartController();
