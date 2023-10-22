const Notification = require("../models/notification.model");

const pushNotiToSystem = async ({
  type = "SHOP-001",
  receivedId = 1,
  senderId = 1,
  options = {},
}) => {
  let noti_content;
  if (type === "SHOP-001") {
    noti_content = `@@@ vua them mot san pham @@@@`;
  } else if ((type = "PROMOTION-001")) {
    noti_content = `@@@ vua moi them mot voucher: @@@@@`;
  }

  const newNoti = await Notification.create({
    noti_type: type,
    noti_content,
    noti_senderId,
    noti_receivedId,
    noti_options,
  });

  return newNoti;
};

const listNotiByUser = async ({ userId = 1, type = "ALL", isRead = 0 }) => {
  const match = { noti_receivedId: userId };
  if (type !== "ALL") {
    match["noti_type"] = type;
  }

  return await Notification.aggregate([
    {
      $match: match,
    },
    {
      $project: {
        noti_type,
        noti_senderId,
        noti_receivedId,
        noti_content,
        createdAt: 1,
        noti_options,
      },
    },
  ]);
};

module.exports = {
  pushNotiToSystem,
  listNotiByUser,
};
