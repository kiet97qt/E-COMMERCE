/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable prefer-const */
const winston = require("winston");
const colors = require("@colors/colors/safe");
const { combine, colorize, label, timestamp, printf, json, splat } =
  winston.format;
const { format } = require("fecha");

const loggerCustomLevels = {
  levels: {
    crit: 0,
    error: 1,
    warn: 2,
    info: 3,
    http: 4,
    verbose: 5,
    debug: 6,
    silly: 7,
  },
  colors: {
    crit: "bgBrightRed",
    error: "red",
    warn: "yellow",
    info: "green",
    http: "blue",
    verbose: "cyan",
    debug: "magenta",
    silly: "white",
  },
};

const timeFormat = () => {
  // return new Date().toLocaleString('en-US', {
  //     timeZone: 'Europe/Istanbul'
  // });

  return format(new Date(), "YYYY-MM-DD hh:mm:ss Z");
};

const winstonOptions = {
  levels: loggerCustomLevels.levels,
  transports: [
    new winston.transports.Console({
      level: "silly",
      format: combine(
        json(),
        splat(),
        label({ label: process.env.APP_NAME || "Winston" }),
        timestamp({ format: "YYYY-MM-DD hh:mm:ss Z" }),
        printf((info) => {
          const colorizer = colorize({
            colors: loggerCustomLevels.colors,
            all: true,
          });
          let {
            label,
            timestamp,
            level,
            context,
            functionName,
            message,
            metadata,
            requestId,
          } = info;

          label = `[${label}]`;
          timestamp = `[${timestamp}]`;
          level = level.toUpperCase().padEnd(8, " ");
          context = context ? ` [${context}]` : "";
          requestId = requestId ? ` [${requestId}]` : "";
          functionName = functionName ? ` [${functionName}]` : "";
          try {
            message =
              typeof message === "string" ? message : JSON.stringify(message);
          } catch (error) {
            // Use to catch error: Converting circular structure to JSON
          }

          metadata = metadata ? ` ||| ${JSON.stringify(metadata)}` : "";

          const returnMessage = `${label} ${timestamp} ${level} |${requestId}|${context}${functionName} ${message}${metadata}`;

          return colorizer.colorize(info.level, colors.bold(returnMessage));
        })
      ),
    }),
  ],
};

module.exports = { winstonOptions };
