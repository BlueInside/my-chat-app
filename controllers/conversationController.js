const Conversation = require('../models/conversation');
const asyncHandler = require('express-async-handler');

const getAllConversations = asyncHandler(async (req, res) => {
  res.send('NOT IMPLEMENTED ');
});

const createConversation = asyncHandler(async (req, res) => {
  res.send('NOT IMPLEMENTED ');
});

const getConversationDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;

  res.send(`NOT IMPLEMENTED ID ${id}`);
});

module.exports = {
  getAllConversations,
  createConversation,
  getConversationDetails,
};
