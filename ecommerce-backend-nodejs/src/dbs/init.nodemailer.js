"use strict";

const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  host: "",
  port: 465,
  secure: true,
  auth: {
    user: "",
    pass: "",
  },
});

module.exports = transport;
