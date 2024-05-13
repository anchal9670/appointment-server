const express = require("express");

const { getUploadUrl , sendOtp} = require("../controller/storage");

const router = express.Router();

router.post("/upload", getUploadUrl);
router.post("/auth/sendOTP",sendOtp);

module.exports = router;
