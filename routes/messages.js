const express = require('express');
const messages = express.Router();

const messageController = require('../controllers/messageController');
const {
  getMessageByIdValidation,
  createMessageValidation,
  deleteMessageValidation,
} = require('../lib/messagesValidation');

// GET specific message by ID
messages.get(
  '/:id',
  getMessageByIdValidation(),
  messageController.getMessageById
);

// Send new message with POST
messages.post('/', createMessageValidation(), messageController.sendMessage);

// Delete a message
messages.delete(
  '/:id',
  deleteMessageValidation(),
  messageController.deleteMessage
);

module.exports = messages;
