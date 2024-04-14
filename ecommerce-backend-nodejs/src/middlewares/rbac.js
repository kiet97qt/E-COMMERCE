const { AuthFailureError } = require("../core/error.response");
const { roleList } = require("../services/rbac.service");
const rbac = require("./role.middleware");

const grantAccess = (action, resource) => {
  return async (req, res, next) => {
    try {
      // cache roleLists, get from cache first
      const roleLists = await roleList({ userId: 9999 });

      rbac.setGrants(roleLists);
      const rol_name = req.query.role;
      const permission = rbac.can(rol_name)[action](resource);
      if (!permission.granted) {
        throw new AuthFailureError("you dont have enough permissions...");
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  grantAccess,
};
