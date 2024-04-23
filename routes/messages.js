const express = require('express');
const messages = express.Router();

const messageController = require('../controllers/messageController');

// GET all messages for a user
messages.get('/', messageController.getAllMessages);

// GET specific message by ID
messages.get('/:id', messageController.getMessageById);

// Send new message with POST
messages.post('/', messageController.sendMessage);

// Delete a message
messages.delete('/:id', messageController.deleteMessage);

module.exports = messages;
