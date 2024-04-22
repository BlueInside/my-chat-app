const express = require('express');
const authenticate = express.Router();
const {
  validateSignup,
  validateLogin,
  validate,
} = require('../lib/validations');
const { sign_up, login } = require('../controllers/authenticateController');

// POST sign-up
authenticate.post('/sign-up', validateSignup, validate, sign_up);

// POST login
authenticate.post('/login', validateLogin, validate, login);
module.exports = authenticate;
