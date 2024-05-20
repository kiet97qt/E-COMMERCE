"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const AccessService = require("../services/access.service");
const {
  newUser,
  checkLoginEmailTokenService,
} = require("../services/user.service");

class UserController {
  newUser = async (req, res, next) => {
    const response = await newUser({
      email: req.body.email,
    });
    new SuccessResponse(response).send(res);
  };

  checkLoginEmailToken = async (req, res, next) => {
    const { token = null } = req.query;
    const response = await checkLoginEmailTokenService({
      token,
    });
    new SuccessResponse(response).send(res);
  };
}

module.exports = new UserController();
