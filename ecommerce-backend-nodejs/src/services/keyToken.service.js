"use strict";
const keytokenModel = require("../models/keytoken.model");
const { Types } = require("mongoose");
class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
    refreshTokenUsed = null,
  }) => {
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
          privateKey,
          refreshTokensUsed: refreshTokenUsed ? [refreshTokenUsed] : [],
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

  static findByRefreshTokenUsed = async (refreshToken) => {
    return await keytokenModel
      .findOne({ refreshTokensUsed: refreshToken })
      .lean();
  };

  static findByRefreshToken = async (refreshToken) => {
    return await keytokenModel.findOne({ refreshToken }).lean();
  };

  static removeKeyByUserId = async (userId) => {
    return await keytokenModel.deleteOne({ user: userId });
  };

  static updateRefreshToken = async ({
    userId,
    refreshToken,
    refreshTokensUsed,
  }) => {
    return await keytokenModel.updateOne(
      { user: userId },
      {
        $set: {
          refreshToken,
        },
        $addToSet: {
          refreshTokensUsed,
        },
      }
    );
  };
}

module.exports = KeyTokenService;
