const Message = require('../models/message');
const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');

const getAllMessages = asyncHandler(async (req, res, next) => {
  const messages = await Message.find({});
  if (!messages) res.status(404).json({ message: 'Messages not found' });
  res.status(200).json({ messages: messages });
});

const getMessageById = asyncHandler(async (req, res, next) => {
  const isValidId = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!isValidId) {
    return res.status(400).json({ message: 'Invalid message id' });
  }

  const message = await Message.findById(req.params.id);

  if (!message) {
    return res.status(404).json({ message: 'Message not found' });
  }

  res.status(200).json({ message: message });
});

const sendMessage = asyncHandler(async (req, res, next) => {
  res.send('POST MESSAGE NOT IMPLEMENTED');
});

const deleteMessage = asyncHandler(async (req, res, next) => {
  res.send('DELETE MESSAGE NOT IMPLEMENTED');
});

module.exports = { getAllMessages, getMessageById, sendMessage, deleteMessage };
