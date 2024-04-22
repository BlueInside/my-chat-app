const User = require('../models/user');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const sign_up = asyncHandler(async (req, res, next) => {
  // Validate here!
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

const login = asyncHandler(async (req, res, next) => {
  // Validate here!
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    // Checks if user was found
    if (!user) res.status(404).json({ message: 'User not found.' });

    const match = await bcrypt.compare(password, user.password);
    // Checks if password match hashed password value.
    if (!match) res.status(401).json({ message: `Password doesn't match.` });

    // Generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '2h',
    });

    // Login user
    res
      .status(200)
      .json({ user: { id: user._id, username: user.username }, token });
  } catch (error) {
    next(error);
  }
});

module.exports = {
  sign_up,
  login,
};
