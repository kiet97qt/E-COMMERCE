"use strict";
const JWT = require("jsonwebtoken");
const { asyncHandler } = require("../helpers/asyncHandler");
const { AuthFailureError, NotFoundError } = require("../core/error.response");
const { findByUserId } = require("../services/keyToken.service");

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
  REFRESHTOKEN: "x-rtoken-id",
};

//cach 1
// const createTokenPair = async (payload, publicKey, privateKey) => {
//   try {
//     const accessToken = await JWT.sign(payload, privateKey, {
//       algorithm: "RS256",
//       expiresIn: "2 days",
//     });

//     const refreshToken = await JWT.sign(payload, privateKey, {
//       algorithm: "RS256",
//       expiresIn: "7 days",
//     });

//     JWT.verify(accessToken, publicKey, (err, decode) => {
//       if (err) {
//         console.error(`error verify::`, err);
//       } else {
//         console.log(`decode verify::`, decode);
//       }
//     });
//     return { accessToken, refreshToken };
//   } catch (error) {}
// };

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: "2 days",
    });

    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: "7 days",
    });

    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.error(`error verify::`, err);
      } else {
        console.log(`decode verify::`, decode);
      }
    });
    return { accessToken, refreshToken };
  } catch (error) {
    throw error;
  }
};

const authentication = asyncHandler(async (req, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureError("Invalid Request");

  const keyStore = await findByUserId(userId);
  if (!keyStore) throw new NotFoundError("Not found keyStore");

  if (
    req.headers[HEADER.REFRESHTOKEN] &&
    req.url === "/shop/handlerRefreshToken"
  ) {
    // chỉ handle cho API call để refresh accessToken
    try {
      const refreshToken = req.headers[HEADER.REFRESHTOKEN];
      const decodedUser = JWT.verify(refreshToken, keyStore.privateKey);
      if (userId !== decodedUser.userId)
        throw new AuthFailureError("Invalid UserId");
      req.keyStore = keyStore;
      req.user = decodedUser;
      req.refreshToken = refreshToken;
      return next();
    } catch (error) {
      throw error;
    }
  }

  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError("Invalid Request");

  try {
    const decodedUser = JWT.verify(accessToken, keyStore.publicKey);
    if (userId !== decodedUser.userId)
      throw new AuthFailureError("Invalid UserId");
    req.keyStore = keyStore;
    req.user = decodedUser;
  } catch (error) {
    throw error;
  }
  return next();
});

const verifyJWT = async (token, keySecret) => {
  return await JWT.verify(token, keySecret);
};

module.exports = {
  createTokenPair,
  authentication,
  verifyJWT,
};
