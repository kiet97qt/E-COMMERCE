"use strict";

const redis = require("redis");
const { promisify } = require("util");
const {
  reservationInventory,
} = require("../models/repositories/inventory.repo");
const redisClient = redis.createClient({
  url: "redis://localhost:6381",
  password: "e-commerce-dev",
});
redisClient.connect().catch((error) => {
  Logger.error(`[RedisEmitter] ${JSON.stringify(error)}`);
  throw error;
});
// Listen for the 'connect' event to check if the connection is successful.
redisClient.on("connect", () => {
  console.log("Connected to Redis server");
});

// Listen for the 'error' event to capture any connection errors.
redisClient.on("error", (error) => {
  console.error("Redis connection error: ", error);
});

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
