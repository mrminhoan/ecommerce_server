"use strict";

const { default: mongoose } = require("mongoose");
const os = require("os");
const _SECOND = 5000;

// Count Connect
const countConnect = () => {
  return mongoose.connections.length;
};

// Check overload connect
const checkOverload = () => {
  const numConnection = countConnect();
  const numCores = os.cpus().length;
  const memoryUsage = process.memoryUsage().rss;
  const maxConnections = numCores * 5;
  console.log(`Active connection: ${numConnection}`);
  console.log(`Memory usage: ${(memoryUsage / 1024 / 1024).toFixed(3)} MB`);
  console.log(`----------------------------------------------`);

  if (numConnection > maxConnections) {
    console.log(`Connection overload detected`);
  }
  // setInterval(() => {
  //   const numConnection = countConnect();
  //   const numCores = os.cpus().length;
  //   const memoryUsage = process.memoryUsage().rss;
  //   const maxConnections = numCores * 5;
  //   console.log(`Active connection: ${numConnection}`);
  //   console.log(`Memory usage: ${(memoryUsage / 1024 / 1024).toFixed(3)} MB`);
  //   console.log(`----------------------------------------------`);

  //   if (numConnection > maxConnections) {
  //     console.log(`Connection overload detected`);
  //   }
  // }, _SECOND); //Monitor every 5 seconds
};

module.exports = { countConnect, checkOverload };
