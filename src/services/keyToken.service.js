"use strict";
const keytokenModel = require("../models/keytoken.model");
const { Types } = require("mongoose");
class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey, refreshToken }) => {
    try {
      //lv0
      // const publicKeyString = publicKey.toString();
      // const tokens = await keytokenModel.create({
      //   user: userId,
      //   publicKey: publicKeyString,
      // });
      // return tokens ? tokens.publicKey : null;

      const filter = { user: userId },
        update = {
          publicKey,
          refreshTokensUsed: [],
          refreshToken,
        },
        options = {
          upsert: true,
          new: true,
        };

      const tokens = await keytokenModel.findOneAndUpdate(
        filter,
        update,
        options
      );

      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };

  static findByUserId = async (userId) => {
    return await keytokenModel
      .findOne({ user: new Types.ObjectId(userId) })
      .lean();
  };

  static removeKeyById = async (id) => {
    return await keytokenModel.deleteOne({ _id: id });
  };
}

module.exports = KeyTokenService;
