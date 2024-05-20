"use strict";

const _ = require("lodash");
const { Types } = require("mongoose");

const convertToObjectMongodb = (id) => new Types.ObjectId(id);

const getInfoData = ({ fileds = [], object = {} }) => {
  return _.pick(object, fileds);
};

const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};

const unGetSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 0]));
};

const removeUndefinedObject = (obj) => {
  Object.keys(obj).forEach((k) => {
    if (obj[k] == null) {
      delete obj[k];
    }
  });
  return obj;
};

const updateNestedObjectParser = (obj) => {
  const final = {};
  Object.keys(obj).forEach((k) => {
    if (typeof obj[k] === "object" && !Array.isArray(obj[k])) {
      const response = updateNestedObjectParser(obj[k]);
      Object.keys(response).forEach((a) => {
        final[`${k}.${a}`] = response[a];
      });
    } else {
      final[k] = obj[k];
    }
  });
  return final;
};

const replacePlaceHolder = (template, params) => {
  Object.keys(params).forEach((k) => {
    const placeholder = `{{${k}}}`;
    template = template.replace(new RegExp(placeholder, "g"), params[k]);
  });
  return template;
};

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

module.exports = {
  getInfoData,
  getSelectData,
  unGetSelectData,
  removeUndefinedObject,
  updateNestedObjectParser,
  convertToObjectMongodb,
  replacePlaceHolder,
  sleep,
};
