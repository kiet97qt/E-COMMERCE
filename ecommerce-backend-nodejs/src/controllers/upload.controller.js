"use strict";

const { SuccessResponse } = require("../core/success.response");
const { BadRequestError } = require("../core/error.response");

const UploadService = require("../services/upload.service");

class UploadController {
  uploadFile = async (req, res, next) => {
    new SuccessResponse({
      message: "uploadFile successfully!!!",
      metadata: await UploadService.uploadImageFromUrl(),
    }).send(res);
  };

  uploadFileThumb = async (req, res, next) => {
    const { file } = req;
    if (!file) {
      throw new BadRequestError("File missing");
    }
    new SuccessResponse({
      message: "uploadFileThumb successfully!!!",
      metadata: await UploadService.uploadImageFromLocal({
        path: file.path,
      }),
    }).send(res);
  };

  uploadImageFromLocalFiles = async (req, res, next) => {
    const { files } = req;
    if (!files.length) {
      throw new BadRequestError("File missing");
    }
    new SuccessResponse({
      message: "uploadImageFromLocalFiles successfully!!!",
      metadata: await UploadService.uploadImageFromLocalFiles({
        files,
      }),
    }).send(res);
  };
}

module.exports = new UploadController();
