"use strict";

const { Client, GatewayIntentBits } = require("discord.js");

class LoggerService {
  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });

    this.channelId = process.env.CHANNELID_DISCORD;

    this.client.on("ready", () => {
      console.log(`Logged is as ${this.client.user.tag}!`);
    });

    const token = process.env.TOKEN_DISCORD;
    this.client.login(token);
  }

  sendToFormatCode(logData) {
    const { code, message = "mess empty", title = "log" } = logData;

    const codeMess = {
      content: message,
      embeds: [
        {
          color: parseInt("00ff00", 16),
          title,
          description: "```json\n" + JSON.stringify(code, null, 2) + "\n```",
        },
      ],
    };
    this.sendMessageToDiscord(codeMess);
  }

  sendMessageToDiscord(mess = "message") {
    const channel = this.client.channels.cache.get(this.channelId);
    if (!channel) {
      console.error(`Counldn't find the channel...`, this.channelId);
      return;
    }
    channel.send(mess).catch((err) => console.log(err));
  }
}

const loggerService = new LoggerService();

module.exports = loggerService;
