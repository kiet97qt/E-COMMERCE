"use strict";
const redis = require("redis");
const { InternalError } = require("../core/error.response");
let redisClients = {};
let statusConnectRedis = {
  CONNECT: "connect",
  END: "end",
  RECONNECT: "reconnecting",
  ERROR: "error",
};
let connectionTimeout = [];

const REDIS_CONNECT_TIMEOUT = 10000;
const REDIS_CONNECT_MESSAGE = {
  code: 500,
  message: "Service Redis connection error",
};

const handleTimeoutError = () => {
  connectionTimeout.push(
    setTimeout(() => {
      throw new InternalError(
        REDIS_CONNECT_MESSAGE.message,
        REDIS_CONNECT_MESSAGE.code
      );
    }, REDIS_CONNECT_TIMEOUT)
  );
};

function clearConnectionTimeout() {
  connectionTimeout.forEach((timeoutId) => {
    clearTimeout(timeoutId);
  });
  connectionTimeout = [];
}

const handleEventConnection = ({ connectionRedis }) => {
  connectionRedis.on(statusConnectRedis.CONNECT, () => {
    console.log(`connectionRedis - Connection status: connected`);
    clearConnectionTimeout();
  });

  connectionRedis.on(statusConnectRedis.END, async () => {
    console.log(`connectionRedis - Connection status: disconnected`);
    handleTimeoutError();
  });

  // connectionRedis.on(statusConnectRedis.RECONNECT, () => {
  //   console.log(`connectionRedis - Connection status: reconnecting`);
  //   clearConnectionTimeout();
  // });

  connectionRedis.on(statusConnectRedis.ERROR, async (err) => {
    console.log(
      `connectionRedis - Connection status: error:: ${JSON.stringify(err)}`
    );
    handleTimeoutError();
  });
};

const initRedis = () => {
  const redisClient = redis.createClient({
    url: "redis://localhost:6381",
    password: "e-commerce-dev",
  });
  redisClients.instanceConnect = redisClient;
  redisClient.connect();
  handleEventConnection({
    connectionRedis: redisClient,
  });
};

const getRedis = () => redisClients;

const closeRedis = () => {
  for (const key in redisClients) {
    const redisClient = redisClients[key];
    redisClient.disconnect();
  }
};

module.exports = {
  initRedis,
  getRedis,
  closeRedis,
};
