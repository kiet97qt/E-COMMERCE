"use strict";
const { NotFoundError } = require("../core/error.response.js");
const transport = require("../dbs/init.nodemailer.js");
const { replacePlaceHolder } = require("../utils/index.js");
const { newOtp } = require("./otp.service.js");
const { getTemplate } = require("./template.service.js");

const sendEmailLinkVerify = async ({
  html,
  toEmail,
  subject = "",
  text = "",
}) => {
  try {
    const mailOptions = {
      from: ' "ShopDEV" <anonystick@gmail.com>',
      to: toEmail,
      subject,
      text,
      html,
    };

    transport.sendMail(mailOptions, (err, info) => {
      if (err) {
        return console.log(err);
      }
      console.log("Message sent::", info.messageId);
    });
  } catch (error) {
    console.error("err send email", error);
    return error;
  }
};

const sendEmailToken = async ({ email = null }) => {
  try {
    //1. get Token
    const token = await newOtp({ email });
    //2. get Template
    const template = await getTemplate({
      temp_name,
    });

    if (!template) {
      throw new NotFoundError("Template not found");
    }
    //3. send email
    const content = replacePlaceHolder(template.temp_html, {
      link_verify: `http://localhost:3056/v1/api/user/welcome-back?token=${token.otp_token}`,
    });
    sendEmailLinkVerify({
      html,
      toEmail: email,
      subject: "Confirm Register Shopdev Email",
    }).catch((err) => console.error(err));
    return true;
  } catch (error) {
    throw error;
  }
};

module.exports = { sendEmailToken };
