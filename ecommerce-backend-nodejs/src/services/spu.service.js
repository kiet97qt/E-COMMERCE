"use strict";

const { findShopById } = require("../models/repositories/shop.repo");
const SPU_MODLE = require("../models/spu.model");
const { randomProductId } = require("../utils");
const { newSku } = require("./sku.service");
const { omit } = require("lodash");
const newSpu = async ({
  product_id,
  product_name,
  product_thumb,
  product_description,
  product_price,
  product_category,
  product_shop,
  product_attributes,
  product_quantity,
  product_variations,
  sku_list = [],
}) => {
  try {
    // 1./ check if shop exists
    const foundShop = await findShopById({
      shop_id: product_shop,
    });

    if (!foundShop) throw new Error(`Shop not found`);

    //2. create a new SPU
    const spu = await SPU_MODLE.create({
      product_id: randomProductId(),
      product_name,
      product_thumb,
      product_description,
      product_price,
      product_category,
      product_shop,
      product_attributes,
      product_quantity,
      product_variations,
    });

    //3. get spu_id add to sku service
    if (spu && sku_list.legnth) {
      await newSku({
        sku_list,
        spu_id: spu.product_id,
      });
    }

    //4. sync data via elasticsearch (search.service)

    //5. respond result object
    return !!spu;
  } catch (error) {
    console.log(error);
  }
};

const oneSpu = async ({ spu_id }) => {
  try {
    const spu = await SPU_MODLE.findOne({
      product_id: spu_id,
      isPublished: false,
    });
    if (!spu) throw new Error("spu not found");
    const skus = await allSkuBySpuId({ product_id: spu.product_id });

    return {
      spu_info: omit(spu, ["__V", "updatedAt"]),
      sku_list: skus.map((sku) =>
        omit(sku, ["__v", "updatedAt", "createdAt", "isDeleted"])
      ),
    };
  } catch (error) {
    return {};
  }
};
module.exports = {
  newSpu,
  oneSpu,
};
