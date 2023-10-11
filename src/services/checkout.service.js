"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");
const { cart } = require("../models/cart.model");
const { order } = require("../models/order.model");
const { findCartById } = require("../models/repositories/cart.repo");
const {
  findAllDiscountCodesUnSelect,
  checkDiscountExists,
} = require("../models/repositories/discount.repo");
const {
  findAllProducts,
  getProductById,
  checkProductByServer,
} = require("../models/repositories/product.repo");
const { convertToObjectMongodb } = require("../utils");
const DiscountService = require("./discount.service");
const { acquireLock, releaseLock } = require("./redis.service");

class CheckoutService {
  /*
  {
    cartId,
    userId,
    shop_order_ids: [
      {
        shopId,
        shop_discounts: [],
        item_products: [
          {
            price,
            quantity,
            productId
          }
        ]
      }
    ]
  }
 */
  static async checkoutReview({ cartId, userId, shop_order_ids }) {
    const foundCart = await findCartById(cartId);
    if (!foundCart) {
      throw new BadRequestError("Cart does not exists!");
    }

    const checkout_order = {
      totalPrice: 0, // tong tien hang
      feeShip: 0, // phi van chuyen
      totalDiscount: 0, // tong tien discount giam gia
      totalCheckout: 0, // tong thanh toan
    };

    const shop_order_ids_new = [];
    // tinh tong tien bill
    for (let i = 0; i < shop_order_ids.length; i++) {
      const {
        shopId,
        shop_discounts = [],
        item_products = [],
      } = shop_order_ids[i];
      // check product availabe
      const checkProductServer = await checkProductByServer(item_products);
      console.log(`checkProductServer::`, checkProductServer);
      if (!checkProductServer[0]) {
        throw new BadRequestError("order wrong!!!");
      }
      // tong tien don hang
      const checkoutPrice = checkProductServer.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);

      // tong tien truoc khi xu ly

      checkout_order.totalPrice += checkoutPrice;

      const itemCheckout = {
        shopId,
        shop_discounts,
        priceRaw: checkoutPrice,
        priceApplyDiscount: checkoutPrice,
        item_products: checkProductServer,
      };

      if (shop_discounts.length > 0) {
        //gia su chi co mot discount
        // get amount discount
        const { totalPrice, discount = 0 } =
          await DiscountService.getDiscountAmount({
            codeId: shop_discounts[0].codeId,
            userId,
            shopId,
            products: checkProductServer,
          });
        //tong cong discount giam gia
        checkout_order.totalDiscount += discount;

        if (discount > 0) {
          itemCheckout.priceApplyDiscount = checkoutPrice - discount;
        }
      }

      checkout_order.totalCheckout += itemCheckout.priceApplyDiscount;
      shop_order_ids_new.push(itemCheckout);
    }
    return {
      shop_order_ids,
      shop_order_ids_new,
      checkout_order,
    };
  }

  static async orderByUser({
    cartId,
    userId,
    user_address = {},
    user_payment = {},
  }) {
    const { shop_order_ids_new, checkout_order } =
      await CheckoutService.checkoutReview({
        cartId,
        userId,
        shop_order_ids,
      });
    // check lai mot lan nua xem vuot ton kho hay ko ?
    // get new array products
    const products = shop_order_ids_new.flatMap((order) => order.item_products);
    console.log(`[1]`, products);
    const acquireProduct = [];
    for (let i = 0; i < products.length; i++) {
      const { productId, quantity } = products[i];
      const keyLock = await acquireLock(productId, quantity, cartId);
      acquireProduct.push(keyLock ? true : false);
      if (keyLock) {
        await releaseLock(keyLock);
      }
    }

    // check if co mot san  pham het hang trong kho
    if (acquireProduct.includes(false)) {
      throw new Error(
        "Mot so san pham da duoc cap nhat, vui long quay lai gio hang..."
      );
    }
    // create new order
    const newOrder = await order.create({
      order_userId: userId,
      order_checkout: checkout_order,
      order_shipping: user_address,
      order_payment: user_payment,
      order_products: shop_order_ids_new,
    });

    // truong hop: new insert thanh cong, thi remove product co trong cart
    if (newOrder) {
      // remove product in my cart
    }
    return newOrder;
  }

  /*
    Query Orders [Users]
  */
  static async getOrdersByuser() {}

  /*
    Query Order Using Id [Users]
  */
  static async getOneOrderByuser() {}

  /*
    cancle Order [Users]
  */
  static async cancelOrderByUser() {}

  /*
    Update Order Status [Shop | Admin]
  */
  static async updateOrdersStatusByShop() {}
}

module.exports = CheckoutService;
