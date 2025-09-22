const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'user' },
  otp: String, // 🔐 4-digit OTP
  otpVerified: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', userSchema);
