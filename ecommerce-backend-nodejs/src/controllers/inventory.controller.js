"use strict";

const { SuccessResponse } = require("../core/success.response");
const InventoryService = require("../services/inventory.service");
class InventoryController {
  //new
  addStockToInventory = async (req, res, next) => {
    new SuccessResponse({
      message: "Successful addToCart",
      metadata: await InventoryService.addStockToInventory(req.body),
    }).send(res);
  };
}

module.exports = new InventoryController();
