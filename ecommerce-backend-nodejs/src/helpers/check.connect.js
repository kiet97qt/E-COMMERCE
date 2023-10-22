"use strict";

const mongoose = require("mongoose");
const os = require("os");
const process = require("process");
const __SECONDS = 5000;
const countConnect = () => {
  const numConnection = mongoose.connections.length;
  console.log(`Number of connections::${numConnection}`);
};

const checkOverload = () => {
  setInterval(() => {
    const numConnection = mongoose.connections.length;
    const numcores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;

    const maxConnections = numcores * 5;

    console.log(`Active connections:: ${numConnection}`);
    console.log(`Memory usage:: ${memoryUsage / 1024 / 1024} MB`);
    if (numConnection > maxConnections) {
      console.log(`Connection overload detected!`);
    }
  }, __SECONDS);
};

module.exports = {
  countConnect,
  checkOverload,
};
