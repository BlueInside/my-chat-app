const User = require('../models/user');
const asyncHandler = require('express-async-handler');
// Get all users
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});

  return res.status(200).json({ users: users });
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }
  res.json(user);
});

const createUser = asyncHandler(async (req, res, next) => {
  // Validation !
  const newUser = await User.create(req.body);
  if (!newUser) res.status(400).json({ message: 'Error creating new user.' });

  res.status(201).json(newUser);
});

const updateUser = asyncHandler(async (req, res, next) => {
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

  return res
    .status(200)
    .json({ message: 'User updated successfully.', user: updatedUser });
});

const deleteUser = asyncHandler(async (req, res, next) => {
  const deletedUser = await User.findByIdAndDelete(req.params.id);
  if (!deletedUser) {
    return res.status(404).json({ message: 'User not found.' });
  }
  res.send(204).json({ message: 'User deleted successfully' });
});

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
