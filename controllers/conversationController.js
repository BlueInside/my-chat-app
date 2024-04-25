const Conversation = require('../models/conversation');
const asyncHandler = require('express-async-handler');

const getAllConversations = asyncHandler(async (req, res) => {
  // Use jwt payload to get userId
  const userId = 2;
  const conversations = await Conversation.find({ participants: userId });

  res.status(200).json({ conversations: conversations });
});

const createConversation = asyncHandler(async (req, res) => {});

const getConversationDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;

  res.send(`NOT IMPLEMENTED ID ${id}`);
});

module.exports = {
  getAllConversations,
  createConversation,
  getConversationDetails,
};
