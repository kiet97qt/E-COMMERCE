const AccessControl = require("accesscontrol");

// let grantList = [
//   {
//     role: "admin",
//     resource: "profile",
//     action: "read:any",
//     attributes: "*",
//   },
//   { role: "shop", resource: "profile", action: "read:own", attributes: "*" },
// ];
module.exports = new AccessControl();
