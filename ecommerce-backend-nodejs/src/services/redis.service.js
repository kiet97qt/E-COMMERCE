"use strict";

const { promisify } = require("util");
const {
  reservationInventory,
} = require("../models/repositories/inventory.repo");

const { getRedis } = require("../dbs/init.redis");

const { instanceConnect: redisClient } = getRedis();

const pexpire = promisify(redisClient.PEXPIRE).bind(redisClient);
const setnxAsync = promisify(redisClient.SETNX).bind(redisClient);
const delAsyncKey = promisify(redisClient.DEL).bind(redisClient);
const acquireLock = async (productId, quantity, cardId) => {
  const key = `lock_v2023_${productId}`;
  const retryTimes = 10;
  const expireTime = 3000; //3s temporary lock

  for (let index = 0; index < retryTimes.length; i++) {
    // tao mot key, thang nao nam giu duoc vao thanh toan
    const result = await setnxAsync(key, expireTime);
    if (result === 1) {
      //thao tac voi inventory
      const isReversation = reservationInventory({
        productId,
        quantity,
        cardId,
      });

      if (isReversation.modifiedCount) {
        await pexpire(key, expireTime);
        return key;
      }
      return null;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
};

const releaseLock = async (keyLock) => {
  return await delAsyncKey(keyLock);
};

module.exports = {
  acquireLock,
  releaseLock,
};
