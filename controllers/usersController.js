const User = require('../models/user');
const asyncHandler = require('express-async-handler');
require('dotenv').config();

// Get all users

const getAllUsers = asyncHandler(async (req, res) => {
  const searchQuery = req.query.q;
  if (!searchQuery) {
    // return list of all users if no search query
    const users = await User.find({}, 'username').sort({ username: 1 });
    return res.status(200).json({ users: users });
  }

  const regex = new RegExp(searchQuery, 'i');
  const users = await User.find(
    { username: { $regex: regex } },
    'username'
  ).sort({ username: -1 });

  res.status(200).json({ users: users });
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id, '-password');
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }
  res.status(200).json(user);
});

const createUser = asyncHandler(async (req, res, next) => {
  // Validation !
  const newUser = await User.create(req.body);
  if (!newUser) res.status(400).json({ message: 'Error creating new user.' });

  res.status(201).json(newUser);
});

const updateUser = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;
  const currentUserId = req.user.id;
  const isAdmin = req.user.role === 'admin';

  if (currentUserId !== userId && !isAdmin) {
    return res.status(403).json({ message: 'permission denied.' });
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!updatedUser) {
    return res.status(400).json({ message: 'Error updating user.' });
  }

  return res.status(200).json({
    message: 'User updated successfully.',
    user: updatedUser,
    fileDetails: req.file,
  });
});

const deleteUser = asyncHandler(async (req, res, next) => {
  // Admin can delete any account, user can delete only his own.
  if (req.user.role === 'admin' || req.user.id === req.params.id) {
    const deletedUser = await User.findByIdAndDelete(
      req.user.role === 'admin' ? req.params.id : req.user.id
    );
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.status(200).json({ message: 'User deleted successfully' });
  } else {
    return res
      .status(403)
      .json({ message: 'Access forbidden: Insufficient permissions.' });
  }
});

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
