"use strict";
const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const {
  BadRequestError,
  AuthFailureError,
  ForbiddenError,
} = require("../core/error.response");
const { findByEmail } = require("./shop.service");
const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  static handlerRefreshToken = async ({ keyStore, user, refreshToken }) => {
    const { userId, email } = user;

    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
      await KeyTokenService.removeKeyByUserId(userId);
      throw new ForbiddenError(" Something wrong happend !! Please relogin");
    }

    if (keyStore.refreshToken !== refreshToken)
      throw new AuthFailureError("Shop not registered 1");

    //  check UserId
    const foundShop = await findByEmail({ email });

    if (!foundShop) throw new AuthFailureError(" Shop not registered 2");

    //create 1 cap moi
    const tokens = await createTokenPair(
      {
        userId,
        email,
      },
      keyStore.publicKey,
      keyStore.privateKey
    );

    //update token

    await KeyTokenService.updateRefreshToken({
      userId,
      refreshToken: tokens.refreshToken,
      refreshTokensUsed: refreshToken,
    });

    return {
      user,
      tokens,
    };
  };
  // cach 1
  // static async #handleToken(newShop, email) {
  //   const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
  //     modulusLength: 4096,
  //     publicKeyEncoding: {
  //       type: "pkcs1",
  //       format: "pem",
  //     },
  //     privateKeyEncoding: {
  //       type: "pkcs1",
  //       format: "pem",
  //     },
  //   });
  //   console.log({ privateKey, publicKey });
  //   const publicKeyObject = crypto.createPublicKey(publicKey);
  //   // created token pair
  //   const tokens = await createTokenPair(
  //     {
  //       userId: newShop._id,
  //       email,
  //     },
  //     publicKeyObject,
  //     privateKey
  //   );

  //   const publicKeyString = await KeyTokenService.createKeyToken({
  //     userId: newShop._id,
  //     publicKey,
  //     refreshToken: tokens.refreshToken,
  //   });

  //   if (!publicKeyString) {
  //     throw new BadRequestError("Error: publicKeyString error");
  //   }
  //   return tokens;
  // }

  // cach 2
  static async #handleToken(newShop, email, refreshTokenUsed = null) {
    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");
    console.log({ privateKey, publicKey });

    // created token pair
    const tokens = await createTokenPair(
      {
        userId: newShop._id,
        email,
      },
      publicKey,
      privateKey
    );

    const keyStore = await KeyTokenService.createKeyToken({
      userId: newShop._id,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
      refreshTokenUsed,
    });

    if (!keyStore) {
      throw new BadRequestError("Error: keyStore error");
    }

    return tokens;
  }

  static signUp = async ({ name, email, password }) => {
    const holderShop = await shopModel.findOne({ email }).lean();
    if (holderShop) {
      throw new BadRequestError("Error: shop already registered");
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP],
    });
    if (newShop) {
      const tokens = await this.#handleToken(newShop, email);
      console.log(`Created Token Success::`, tokens);

      return {
        code: 201,
        metadata: {
          shop: getInfoData({
            fileds: ["_id", "name", "email"],
            object: newShop,
          }),
          tokens,
        },
      };
    }
  };

  static login = async ({ email, password, refreshToken = null }) => {
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new BadRequestError("Shop not registered");
    const match = bcrypt.compare(password, foundShop.password);
    if (!match) throw new AuthFailureError("Authentication Error");

    const tokens = await this.#handleToken(foundShop, email, refreshToken);

    return {
      shop: getInfoData({
        fileds: ["_id", "name", "email"],
        object: foundShop,
      }),
      tokens,
    };
  };

  static logout = async ({ keyStore }) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id);
    return delKey;
  };
}
module.exports = AccessService;
