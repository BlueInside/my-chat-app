const express = require('express');
const authenticate = express.Router();
const {
  validateSignup,
  validateLogin,
  validate,
} = require('../lib/validations');
const { signUp, login } = require('../controllers/authenticateController');

// POST sign-up
authenticate.post('/sign-up', validateSignup, validate, signUp);

// POST login
authenticate.post('/login', validateLogin, validate, login);
module.exports = authenticate;
