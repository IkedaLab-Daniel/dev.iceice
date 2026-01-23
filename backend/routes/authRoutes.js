const express = require('express');
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

// @route   /api/auth/register
router.post('/register', register);

// @route   /api/auth/login
router.post('/login', login);

// @route   /api/auth/me
router.post('/me', protect, getMe);

module.exports = router;