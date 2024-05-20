"use strict";
const { SuccessResponse } = require("../core/success.response");
const USER = require("../models/user.model");
const { sendEmailToken } = require("./email.service");
const { checkEmailToken } = require("./otp.service");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const { createUser } = require("../models/repositories/user.repo");
const { getInfoData } = require("../utils");

const newUser = async ({ email = null, captcha = null }) => {
  // 1./ check email exists in dbs
  const user = await USER.findOne({}).lean();

  // if exists
  if (user) {
    return new Error("Email already exists");
  }

  //3. send token via email user
  const result = await sendEmailToken({ email });
  return {
    message: "verify email user",
    metadata: {
      token: result,
    },
  };
};

const checkLoginEmailTokenService = async ({ token }) => {
  try {
    //1. check token in mode otp
    const { otp_email: email, otp_token } = await checkEmailToken({ token });
    if (!email) throw new Error("Token not found");

    //2. check email exists in user model
    const hasUser = await findUserByEmailWithLogin({ email });
    if (hasUser) throw new Error(`Email already exists`);
    // new user
    const passwordHash = await bcrypt.hash(email, 10);
    const newUser = await createUser({
      usr_id: 1,
      usr_slug: "zxczxczxc",
      usr_name: email,
      usr_password: passwordHash,
      usr_role: "",
    });

    if (newUser) {
      const privateKey = crypto.randomBytes(64).toString("hex");
      const publicKey = crypto.randomBytes(64).toString("hex");

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
        userId: newUser.usr_id,
        publicKey,
        privateKey,
        refreshToken: tokens.refreshToken,
        refreshTokenUsed,
      });

      if (!keyStore) {
        throw new BadRequestError("Error: keyStore error");
      }

      return {
        code: 201,
        message: "verify successfully",
        metadata: {
          user: getInfoData({ fileds: ["usr_id", "usr_name", "usr_email"] }),
          tokens,
        },
      };
    }
  } catch (error) {
    throw error;
  }
};

const findUserByEmailWithLogin = async ({}) => {
  const user = await USER.findOne({ usr_email: email }).lean();
  return user;
};

module.exports = { newUser, checkLoginEmailTokenService };
