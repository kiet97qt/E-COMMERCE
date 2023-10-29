"use strict";

const {
  consumerToQueue,
  consumerToQueueFailed,
  consumerToQueueNormal,
} = require("./src/services/consumerQueue.service");

const queueName = "test-topic";

// consumerToQueue(queueName)
//   .then(() => console.log(`Message consumer started ${queueName}`))
//   .catch((err) => {
//     console.log(`Message error: ${err.message}`);
//   });

consumerToQueueFailed(queueName)
  .then(() => console.log(`Message consumer started`))
  .catch((err) => {
    console.log(`Message error: ${err.message}`);
  });

consumerToQueueNormal(queueName)
  .then(() => console.log(`Message consumer started`))
  .catch((err) => {
    console.log(`Message error: ${err.message}`);
  });
