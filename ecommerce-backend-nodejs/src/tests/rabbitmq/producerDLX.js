const amqp = require("amqplib");
const messages = "new a product: Title XXX";

const runProducer = async () => {
  try {
    const connection = await amqp.connect("amqp://admin:admin@localhost:5672");
    const channel = await connection.createChannel();

    const notificationExchange = "notificationEx";
    const notiQueue = "notificationQueueProcess";
    const notificationExchangeDLX = "notificationExDLX";
    const notificationRoutingKeyDLX = "notificationRoutingKeyDLX";

    //1. create Exchange
    await channel.assertExchange(notificationExchange, "direct", {
      durable: true,
    });

    //2. create Queue
    const queueResult = await channel.assertQueue(notiQueue, {
      exclusive: false, // cho phep cac ket noi truy cap vao cung mot luc hang doi
      deadLetterExchange: notificationExchangeDLX,
      deadLetterRoutingKey: notificationRoutingKeyDLX,
    });
    //3. bindQueue
    await channel.bindQueue(queueResult.name, notificationExchange);

    //4. send message
    const msg = "a new product";
    channel.sendToQueue(queueResult.queue, Buffer.from(msg), {
      expiration: "10000",
    });
    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);
  } catch (error) {
    console.error(`errors: `, error);
  }
};

runProducer()
  .then((rs) => console.log(rs))
  .catch((err) => console.log(err));
