"user strict";
const amqp = require("amqplib");

async function consumerOrderedMessage() {
  const connection = await amqp.connect("amqp://admin:admin@localhost:5672");
  const channel = await connection.createChannel();

  const queueName = "ordered-queued-message";
  await channel.assertQueue(queueName, {
    durable: true,
  });

  channel.consume(queueName, (msg) => {
    const message = msg.connect.toString();
    setTimeout(() => {
      console.log(() => {
        console.log("processed: ", message);
        channel.ack(true);
      }, Math.random() * 1000);
    });
  });
}

consumerOrderedMessage().catch((err) => console.log(err));
