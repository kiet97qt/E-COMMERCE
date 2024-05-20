"use strict";
const TEMPLATE = require("../models/template.model");
const { htmlEmailToken } = require("../utils/temp.html");

const newTemplate = async ({ temp_name }) => {
  //1. check if template exists
  //2 create a new template
  const newTemp = await TEMPLATE.create({
    temp_name,
    temp_html: htmlEmailToken(),
  });
  return newTemp;
};

const getTemplate = async ({ temp_name }) => {
  const template = await TEMPLATE.findOne({
    temp_name,
  });
  return template;
};

module.exports = {
  newTemplate,
  getTemplate,
};
