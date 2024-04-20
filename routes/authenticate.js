const express = require('express');
const authenticate = express.Router();
const { sign_up } = require('../controllers/authenticateController');

// POST sign-up
authenticate.post('/sign-up', sign_up);

module.exports = authenticate;
