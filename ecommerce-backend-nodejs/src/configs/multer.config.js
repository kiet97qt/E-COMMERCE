"use strcit";

const multer = require("multer");

const uploadMemory = multer({
  storage: multer.memoryStorage(),
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./src/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const uploadDisk = multer({ storage: storage });

module.exports = {
  uploadMemory,
  uploadDisk,
};
