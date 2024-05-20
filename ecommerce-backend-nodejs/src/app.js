require("dotenv").config();
const compression = require("compression");
const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const { checkOverload } = require("./helpers/check.connect");
const { v4: uuidv4 } = require("uuid");
const { Logger } = require("./loggers/logger.util");
const { initRedis } = require("./dbs/init.redis");
// test common-lib
const { NotificationCategory, Utils } = require("common-lib");
console.log(Utils.HandleErrorDetail);
//

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extends: true }));

// init db
require("./dbs/init.mongodb");
initRedis();
// checkOverload();

app.use((req, res, next) => {
  const requestId = req.headers["x-request-id"];
  req.requestId = requestId || uuidv4();

  let params = {};
  if (req.body) {
    Object.assign(params, { bodyParams: req.body });
  }

  if (req.query) {
    Object.assign(params, { queryParams: req.query });
  }

  const logger = new Logger({
    context: req.path,
    requestId: req.requestId,
    metadata: params,
  });
  logger.info("Input params");
  next();
});

app.post("/:id", (req, res) => {
  res.json(`${JSON.stringify(req.params)}`);
});

app.use("/", require("./routers"));

app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    stack: err.stack,
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
