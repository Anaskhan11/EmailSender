const express = require("express");
const router = express.Router();
const { sendEmails } = require("../controller/sendMessage");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

router.post("/upload", upload.single("file"), sendEmails);

module.exports = router;
