require("dotenv").config();
const compression = require("compression");
const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const { checkOverload } = require("./helpers/check.connect");
const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

// init db
require("./dbs/init.mongodb");
checkOverload();
app.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "Welcome Fantips",
  });
});

module.exports = app;
