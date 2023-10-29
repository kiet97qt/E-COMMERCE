const amqp = require("amqplib");
const messages = "new a product: Title XXX";

const runProducer = async () => {
  try {
    const connection = await amqp.connect("amqp://admin:admin@localhost:5672");
    const channel = await connection.createChannel();

    const queueName = "test-topic";
    await channel.assertQueue(queueName, {
      durable: true,
    });

    channel.sendToQueue(queueName, Buffer.from(messages));
    console.log(`message sent:`, messages);
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
