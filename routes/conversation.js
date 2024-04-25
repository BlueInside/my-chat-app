const express = require('express');
const conversation = express.Router();
const conversationController = require('../controllers/conversationController.js');
const {
  createConversationValidation,
} = require('../lib/conversationValidations.js');

// Gets all user conversations
conversation.get('/', conversationController.getAllConversations);

// Create new conversation
conversation.post(
  '/',
  createConversationValidation(),
  conversationController.createConversation
);
// Get details of specific conversation
conversation.get('/:id', conversationController.getConversationDetails);

module.exports = conversation;
