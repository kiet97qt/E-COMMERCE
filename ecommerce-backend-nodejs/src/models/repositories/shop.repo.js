const SHOP_MODLE = require("../shop.model");
const selectStruct = {
  email: 1,
  name: 1,
  status: 1,
  roles: 1,
};

const findShopById = async ({ shop_id, select = selectStruct }) => {
  return await SHOP_MODLE.findById(shop_id).select(select);
};
module.exports = {
  findShopById,
};
