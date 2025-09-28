const express = require('express');
const { body } = require('express-validator');
const { register, login, googleLogin } = require('../controllers/authController');

const router = express.Router();

// Register route
router.post(
  '/register',
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
  ],
  register
);

// Login route
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').exists().withMessage('Password is required'),
  ],
  login
);

// Google OAuth login route
router.post('/google', googleLogin);

module.exports = router;