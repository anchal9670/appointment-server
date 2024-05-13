const mongoose = require('mongoose');

const phoneOtpSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 1800, // expires in 30 minutes (1800 seconds)
  },
});

const PhoneOtp = mongoose.model('PhoneOtp', phoneOtpSchema);

module.exports = PhoneOtp;