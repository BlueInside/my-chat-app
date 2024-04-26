const express = require('express');
const conversation = express.Router();
const conversationController = require('../controllers/conversationController.js');
const {
  createConversationValidation,
  conversationDetailsValidation,
} = require('../lib/conversationValidations.js');

const { authenticateToken } = require('../lib/jwt.js');
// Gets all user conversations
conversation.get(
  '/',
  authenticateToken,
  conversationController.getAllConversations
);

// Create new conversation
conversation.post(
  '/',
  authenticateToken,
  createConversationValidation(),
  conversationController.createConversation
);

// Get details of specific conversation
conversation.get(
  '/:id',
  authenticateToken,
  conversationDetailsValidation(),
  conversationController.getConversationDetails
);

module.exports = conversation;
