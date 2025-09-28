const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { OAuth2Client } = require('google-auth-library');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    const user = await User.create({ username, email, password });
    const token = generateToken(user._id);
    res.status(201).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      token,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const match = await user.matchPassword(password);
    if (!match) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = generateToken(user._id);
    res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      token,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Authenticate/Sign up user via Google OAuth
// @route   POST /api/auth/google
// @access  Public
exports.googleLogin = async (req, res, next) => {
  const { token } = req.body;
  try {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name } = payload;
    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      // Generate a random password to satisfy schema requirement
      const randomPwd = Math.random().toString(36).slice(-8);
      user = await User.create({
        username: name || email.split('@')[0],
        email,
        password: randomPwd,
      });
    }
    const jwtToken = generateToken(user._id);
    return res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      token: jwtToken,
    });
  } catch (err) {
    next(err);
  }
};