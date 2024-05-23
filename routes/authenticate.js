const express = require('express');
const authenticate = express.Router();
const { loginValidation, registerValidation } = require('../lib/validations');
const {
  signUp,
  login,
  verifyToken,
} = require('../controllers/authenticateController');
const { authenticateToken } = require('../lib/jwt.js');

// POST register
authenticate.post('/register', registerValidation(), signUp);

// POST login
authenticate.post('/login', loginValidation(), login);

// Post verify-token
authenticate.get('/verify-token', authenticateToken, verifyToken);

module.exports = authenticate;
