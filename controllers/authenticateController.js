const User = require('../models/user');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const sign_up = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  try {
    // Hash password using bcryptjs
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      username: username,
      password: hashedPassword,
    });

    // Check if user was created
    if (!newUser) {
      next(new Error('Error during account creation'));
    }

    // Generate token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '2h',
    });

    res.status(201).json({
      user: newUser,
      token: token,
    });
  } catch (error) {
    // Pass errors to next middleware
    next(error);
  }
});

module.exports = {
  sign_up,
};
