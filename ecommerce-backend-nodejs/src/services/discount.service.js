"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");
const { discount } = require("../models/discount.model");
const {
  findAllDiscountCodesUnSelect,
  checkDiscountExists,
} = require("../models/repositories/discount.repo");
const { findAllProducts } = require("../models/repositories/product.repo");
const { convertToObjectMongodb } = require("../utils");
class DiscountService {
  static async createDiscountCode(payload) {
    const {
      code,
      start_date,
      end_date,
      is_active,
      shopId,
      min_order_value,
      product_ids,
      applies_to,
      name,
      description,
      type,
      value,
      max_value,
      max_uses,
      uses_count,
      users_used,
      max_uses_per_user,
    } = payload;
    // check
    // if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
    //   throw new BadRequestError("Discount code has exprired");
    // }

    if (new Date(start_date) >= new Date(end_date)) {
      throw new BadRequestError("Start date must be before end_date");
    }

    // create index for discount code
    const foundDiscount = await discount
      .findOne({
        discount_code: code,
        discount_shopId: convertToObjectMongodb(shopId),
      })
      .lean();

    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new BadRequestError("Discount exists!!");
    }

    const newDiscount = await discount.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_code: code,
      discount_value: value,
      discount_min_order_value: min_order_value || 0,
      discount_max_value: max_value,
      discount_start_date: start_date,
      discount_end_date: end_date,
      discount_max_uses: max_uses,
      discount_uses_count: uses_count,
      discount_users_used: users_used,
      discount_shopId: shopId,
      discount_max_uses_per_users: max_uses_per_user,
      discount_is_active: is_active,
      discount_applies_to: applies_to,
      discount_product_ids: applies_to === "all" ? [] : product_ids,
    });

    return newDiscount;
  }

  static async updateDiscountCode() {
    //...todo
  }

  static async getAllDiscountCodesWithProduct({
    code,
    shopId,
    userId,
    limit,
    page,
  }) {
    const foundDiscount = await discount
      .findOne({
        discount_code: code,
        discount_shopId: convertToObjectMongodb(shopId),
      })
      .lean();
    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFoundError("Discount not exists!");
    }

    const { discount_applies_to, discount_product_ids } = foundDiscount;
    let products;
    if (discount_applies_to === "all") {
      // get all product
      products = await findAllProducts({
        filter: {
          product_shop: convertToObjectMongodb(shopId),
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }

    if (discount_applies_to === "specific") {
      // get all product
      products = await findAllProducts({
        filter: {
          _id: { $in: discount_product_ids },
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }

    return products;
  }

  static async getAllDiscountCodesByShop({ limit, page, shopId }) {
    const discounts = await findAllDiscountCodesUnSelect({
      limit: +limit,
      page: +page,
      filter: {
        discount_shopId: convertToObjectMongodb(shopId),
        discount_is_active: true,
      },
      unSelect: ["__v"],
      model: discount,
    });
    return discounts;
  }

  static async getDiscountAmount({ codeId, userId, shopId, products }) {
    const foundDiscount = await checkDiscountExists({
      model: discount,
      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectMongodb(shopId),
      },
    });

    if (!foundDiscount) {
      throw new NotFoundError("Discount does not exist");
    }

    const {
      discount_is_active,
      discount_max_uses,
      discount_min_order_value,
      discount_max_uses_per_users,
      discount_users_used,
      discount_start_date,
      discount_type,
      discount_value,
    } = foundDiscount;

    if (!discount_is_active) {
      throw new NotFoundError(`Discount expried!`);
    }

    if (!discount_max_uses) {
      throw new NotFoundError(`Discount are out!`);
    }

    // if (
    //   new Date() < new Date(discount_start_date) ||
    //   new Date() > new Date(discount_end_date)
    // ) {
    //   throw new NotFoundError(`Discount code has expried!`);
    // }

    // check xem co xet gia tri toi thieu hay khong ?
    let totalOrder = 0;
    if (discount_min_order_value > 0) {
      totalOrder = products.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);
      if (totalOrder < discount_min_order_value) {
        throw new NotFoundError(
          `!Discount requires a minium order value of ${discount_min_order_value}`
        );
      }
    }

    if (discount_max_uses_per_users > 0) {
      const userUserDiscount = discount_users_used.find(
        (user) => user.userId === userId
      );
      if (userUserDiscount) {
        //.... todo
      }
    }

    const amount =
      discount_type === " fixed_amount"
        ? discount_value
        : totalOrder * (discount_value / 100);
    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount,
    };
  }

  static async deleteDiscountCode({ shopId, codeId }) {
    const deleted = await discount.findOneAndDelete({
      discount_code: codeId,
      discount_shopId: convertToObjectMongodb(shopId),
    });
    return deleted;
  }

  static async cancleDiscountCode({ shopId, codeId, userId }) {
    const foundDiscount = await checkDiscountExists({
      model: discount,
      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectMongodb(shopId),
      },
    });
    if (!foundDiscount) {
      throw new NotFoundError("Discount does not exist");
    }

    const result = await discount.findByIdAndUpdate(foundDiscount._id, {
      $pull: {
        discount_users_used: userId,
      },
      $inc: {
        discount_max_uses: 1,
        discount_uses_count: -1,
      },
    });

    return result;
  }
}

module.exports = DiscountService;
