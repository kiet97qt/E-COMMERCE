"use strict";

const cloadinary = require("../configs/cloudinary.config");

// 1. upload from url image

const uploadImageFromUrl = async () => {
  try {
    const urlImage =
      "https://down-vn.img.susercontent.com/file/ea47af48797b14d62b0661a2afd0cd4e";
    const foldername = "product/shopId";
    const newFileName = "testDemo";
    const result = await cloadinary.uploader.upload(urlImage, {
      public_id: newFileName,
      folder: foldername,
    });
    console.log(result);
    return result;
  } catch (error) {
    throw error;
  }
};

// 2. upload from url local

const uploadImageFromLocal = async ({ path, folderName = "product/8409" }) => {
  try {
    const result = await cloadinary.uploader.upload(path, {
      public_id: "thumb",
      folder: folderName,
    });
    console.log(result);
    return {
      image_url: result.secure_url,
      shopId: 8409,
      thumb_url: await cloadinary.url(result.public_id, {
        height: 100,
        width: 100,
        format: "jpg",
      }),
    };
  } catch (error) {
    throw error;
  }
};

// 2. upload files from url local

const uploadImageFromLocalFiles = async ({
  files,
  folderName = "product/8409",
}) => {
  try {
    if (!files.length) {
      return;
    }
    const uploadedUrls = [];
    for (const file of files) {
      const result = await cloadinary.uploader.upload(file.path, {
        folder: folderName,
      });
      uploadedUrls.push({
        image_url: result.secure_url,
        shopId: 8409,
        thumb_url: await cloadinary.url(result.public_id, {
          height: 100,
          width: 100,
          format: "jpg",
        }),
      });
    }
    return uploadedUrls;
  } catch (error) {
    throw error;
  }
};

// uploadImageFromUrl().catch();
module.exports = {
  uploadImageFromUrl,
  uploadImageFromLocal,
  uploadImageFromLocalFiles,
};
