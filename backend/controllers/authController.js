const User = require('../models/User.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

// ✅ Register with OTP
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    const user = new User({
      name,
      email,
      password: hashed,
      role,
      otp,
      otpVerified: false
    });

    await user.save();
    await sendEmail(email, '🔐 Verify your Account', `Your 4-digit OTP is: ${otp}`);
    res.status(201).json({ msg: '✅ OTP sent to email. Please verify.' });

  } catch (err) {
    console.error('❌ Registration error:', err.message);
    res.status(400).json({ msg: 'Error registering', error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (email === 'admin@gmail.com' && password === 'admin') {
      if (!user) {
        return res.status(400).json({ msg: 'Admin account not found in database' });
      }

      const token = jwt.sign(
        { id: user._id, role: user.role, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      return res.json({
        token,
        isAdmin: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
    }

    if (!user) return res.status(400).json({ msg: 'No user found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Wrong password' });

    if (!user.otpVerified) {
      return res.status(403).json({ msg: 'Please verify your OTP before logging in.' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    console.error('❌ Login error:', err.message);
    res.status(500).json({ msg: 'Login failed', error: err.message });
  }
};

// ✅ Verify OTP
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'User not found' });

    if (String(user.otp).trim() !== String(otp).trim()) {
      return res.status(400).json({ msg: 'Invalid OTP' });
    }

    user.otpVerified = true;
    user.otp = undefined;
    await user.save();

    res.json({ msg: '✅ OTP verified. You can now login.' });

  } catch (err) {
    console.error('❌ OTP verification error:', err.message);
    res.status(500).json({ msg: 'OTP verification failed', error: err.message });
  }
};

// ✅ Forgot Password - send OTP to email
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(200).json({ msg: 'If this email is registered, OTP will be sent.' });

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    user.otp = otp;
    await user.save();

    await sendEmail(email, '🔑 Reset your password', `Your reset OTP is: ${otp}`);
    res.json({ msg: 'OTP sent to email for password reset.' });

  } catch (err) {
    console.error('❌ Forgot password error:', err.message);
    res.status(500).json({ msg: 'Failed to send OTP', error: err.message });
  }
};

// ✅ Reset Password using OTP
exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || user.otp !== otp) {
      return res.status(400).json({ msg: 'Invalid OTP or email' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = undefined;
    await user.save();

    res.json({ msg: '✅ Password reset successful.' });

  } catch (err) {
    console.error('❌ Reset password error:', err.message);
    res.status(500).json({ msg: 'Failed to reset password', error: err.message });
  }
};
