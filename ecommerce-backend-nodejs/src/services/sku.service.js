"use strict";

const SKU_MODLE = require("../models/sku.model");
const { randomProductId } = require("../utils");
const { omit } = require("lodash");

const newSku = async ({ spu_id, sku_list = [] }) => {
  try {
    const convert_sku_list = sku_list.map((sku) => {
      return {
        ...sku,
        product_id: spu_id,
        sku_id: `${spu_id}.${randomProductId()}`,
      };
    });
    const skus = await SKU_MODLE.create(convert_sku_list);
    return skus;
  } catch (error) {
    return [];
  }
};

const oneSku = async ({ sku_id, product_id }) => {
  try {
    //read cache
    const sku = await SKU_MODLE.findOne({
      sku_id,
      product_id,
    }).lean();

    if (sku) {
      //set cached
    }
    return omit(sku, ["__v", "updatedAt", "createdAt", "isDeleted"]);
  } catch (error) {
    return null;
  }
};

const allSkuBySpuId = async ({ product_id }) => {
  try {
    //read cache
    const skus = await SKU_MODLE.find({
      product_id,
    }).lean();

    return skus;
  } catch (error) {
    return null;
  }
};

module.exports = {
  newSku,
  oneSku,
  allSkuBySpuId,
};
