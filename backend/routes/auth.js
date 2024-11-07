// THIS REQUIRES ANOTHER LOOK THROUGH - AI CODE, THAT I DON'T UNDERSTAND FULLY YET

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const router = express.Router();

// Helper to send verification emails
const sendVerificationEmail = async (user, token) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const verificationLink = `${process.env.CLIENT_URL}/verify/${token}`;
  const mailOptions = {
    from: process.env.EMAIL,
    to: user.email,
    subject: 'Account Verification',
    html: `<p>Click <a href="${verificationLink}">here</a> to verify your account.</p>`
  };

  await transporter.sendMail(mailOptions);
};

// Registration Route
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword, isVerified: false });
    await user.save();

    // Create verification token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    await sendVerificationEmail(user, token);
    res.json({ message: 'Registration successful! Check your email to verify your account.' });
  } catch (error) {
    res.status(400).json({ error: 'Error creating account' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { identifier, password } = req.body; // identifier can be email or username
  try {
    const user = await User.findOne({ $or: [{ email: identifier }, { username: identifier }] });
    if (!user) return res.status(400).json({ message: 'User not found' });
    if (!user.isVerified) return res.status(400).json({ message: 'Account not verified' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Incorrect password' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Email Verification Route
router.get('/verify/:token', async (req, res) => {
  try {
    const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(400).json({ message: 'Invalid token' });

    user.isVerified = true;
    await user.save();
    res.json({ message: 'Account verified! You can now log in.' });
  } catch (error) {
    res.status(400).json({ message: 'Invalid or expired token' });
  }
});

// Protected Route Example
router.get('/protected', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({ message: 'This is a protected route' });
});

module.exports = router;
