"use strict";
const OTP = require("../models/otp.model");

const crypto = require("crypto");

const generatorTokenRandom = () => {
  const token = crypto.randomInt(0, Math.pow(2, 32));
  return token;
};

const newOtp = async ({ email }) => {
  try {
    const token = generatorTokenRandom();
    const newToken = await OTP.create({
      otp_token: token,
      otp_email: email,
    });
    return newToken;
  } catch (error) {
    throw error;
  }
};

const checkEmailToken = async ({ token }) => {
  //check token in model otp
  const token = await OTP.findOne({
    otp_token: token,
  });
  if (!token) throw new Error("token not found");
  OTP.deleteOne({ otp_token: token });
  return token;
};

module.exports = { newOtp, checkEmailToken };
