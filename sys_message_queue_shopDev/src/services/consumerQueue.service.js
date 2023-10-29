"use strict";

const { consumerQueue, connectToRabbitMQ } = require("../dbs/init.rabbit");

const messageService = {
  consumerToQueue: async (queueName) => {
    try {
      const { channel, connection } = await connectToRabbitMQ();
      await consumerQueue(channel, queueName);
    } catch (error) {
      console.error(`consumerToQueue:: ${error}`);
    }
  },

  // case processing
  consumerToQueueNormal: async (queueName) => {
    try {
      const { channel, connection } = await connectToRabbitMQ();
      const notiQueue = "notificationQueueProcess";

      // case 1: TTL

      // setTimeout(() => {
      //   channel.consume(notiQueue, (msg) => {
      //     console.log(
      //       `SEND notificationQueue successfully processed:`,
      //       msg.content.toString()
      //     );
      //     channel.ack(msg);
      //   });
      // }, 15000);

      // case 2: Logic

      channel.consume(notiQueue, (msg) => {
        try {
          const numberTest = Math.random();
          console.log({ numberTest });
          if (numberTest < 0.8) {
            throw new Error("Send notification failed:: HOT FIX");
          }
          console.log(
            `SEND notificationQueue successfully processed:`,
            msg.content.toString()
          );
          channel.ack(msg);
        } catch (error) {
          // console.error(`SEND noti error:`, error);
          channel.nack(msg, false, false);
        }
      });

      console.log();
    } catch (error) {
      console.error(error);
    }
  },

  // case failed
  consumerToQueueFailed: async (queueName) => {
    try {
      const { channel, connection } = await connectToRabbitMQ();
      const notificationExchangeDLX = "notificationExDLX";
      const notificationRoutingKeyDLX = "notificationRoutingKeyDLX";
      const notiQueueHandler = "notificationQueueHotFix";

      await channel.assertExchange(notificationExchangeDLX, "direct", {
        durable: true,
      });

      const queueResult = await channel.assertQueue(notiQueueHandler, {
        exclusive: false, // cho phep cac ket noi truy cap vao cung mot luc hang doi
      });

      await channel.bindQueue(
        queueResult.name,
        notificationExchangeDLX,
        notificationRoutingKeyDLX
      );
      await channel.consume(
        queueResult.queue,
        (msgFailed) => {
          console.log(
            `this noti error:, pls hot fix::`,
            msgFailed.content.toString()
          );
        },
        {
          noAck: true,
        }
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};

module.exports = messageService;
