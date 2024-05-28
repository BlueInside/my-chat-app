const User = require('../models/user');
const asyncHandler = require('express-async-handler');
const stream = require('node:stream');
require('dotenv').config();
const cloudinary = require('cloudinary').v2;

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

  let cloudinaryResult = null;

  if (req.file && req.file.buffer) {
    try {
      cloudinaryResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'image',
            folder: 'my-chat-app-avatars',
            allowed_formats: ['jpg', 'png', 'gif', 'webp'],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        const bufferStream = new stream.PassThrough();
        bufferStream.end(req.file.buffer);
        bufferStream.pipe(uploadStream);
      });
    } catch (error) {
      console.error('cloudinary error:', error);
      return res.status(500).json({ message: 'Failed to upload image' });
    }
  }

  // Fields that can be edited
  const { fullName, bio, dateOfBirth } = req.body;
  const data = { fullName, bio, dateOfBirth };

  const updatedData = cloudinaryResult?.url
    ? { ...data, avatarUrl: cloudinaryResult.url }
    : { ...data };

  const updatedUser = await User.findByIdAndUpdate(req.params.id, updatedData, {
    new: true,
  });

  if (!updatedUser) {
    return res.status(400).json({ message: 'Error updating user.' });
  }

  return res.status(200).json({
    message: 'User updated successfully.',
    user: updatedUser,
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
