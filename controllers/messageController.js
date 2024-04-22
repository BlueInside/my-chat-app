const Message = require('../models/message');
const asyncHandler = require('express-async-handler');

const getAllMessages = asyncHandler(async (req, res, next) => {
  const messages = await Message.find({});

  res.status(200).json({ messages: messages });
});

const getMessageById = asyncHandler(async (req, res, next) => {
  res.send('GET ID MESSAGE NOT IMPLEMENTED');
});

const sendMessage = asyncHandler(async (req, res, next) => {
  res.send('POST MESSAGE NOT IMPLEMENTED');
});

const deleteMessage = asyncHandler(async (req, res, next) => {
  res.send('DELETE MESSAGE NOT IMPLEMENTED');
});

module.exports = { getAllMessages, getMessageById, sendMessage, deleteMessage };
