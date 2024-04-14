"use strict";

const { SuccessResponse } = require("../core/success.response");
const {
  createResource,
  createRole,
  roleList,
  resourceList,
} = require("../services/rbac.service");

class RBACController {
  newRole = async (req, res, next) => {
    new SuccessResponse({
      message: "Created Role",
      metadata: await createRole(req.body),
    }).send(res);
  };

  newResource = async (req, res, next) => {
    new SuccessResponse({
      message: "Created Resource",
      metadata: await createResource(req.body),
    }).send(res);
  };

  listRoles = async (req, res, next) => {
    new SuccessResponse({
      message: "get list roles",
      metadata: await roleList(req.body),
    }).send(res);
  };

  listResources = async (req, res, next) => {
    new SuccessResponse({
      message: "get list Resource",
      metadata: await resourceList(req.body),
    }).send(res);
  };
}

module.exports = new RBACController();
