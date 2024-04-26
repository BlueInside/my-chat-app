const Conversation = require('../models/conversation');
const asyncHandler = require('express-async-handler');

const getAllConversations = asyncHandler(async (req, res) => {
  // Use jwt payload to get userId
  const userId = 2;
  const conversations = await Conversation.find({ participants: userId });

  res.status(200).json({ conversations: conversations });
});

const createConversation = asyncHandler(async (req, res) => {
  // USE JWT
  const { senderId, receiverId } = req.body;

  try {
    const sortedParticipants = [senderId, receiverId].sort(); // Sort participants
    const conversation = await Conversation.create({
      participants: sortedParticipants,
    });

    if (!conversation) {
      return next(new Error('Failed creating a new conversation'));
    }

    return res.status(201).json({ conversation: conversation });
  } catch (error) {
    if (error.code === 11000) {
      // MongoDB duplicate key error
      res.status(409).json({ message: 'Conversation already exists.' });
    } else {
      return next(error);
    }
  }
});

const getConversationDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const conversation = await Conversation.findById(id).populate({
    path: 'messages',
    options: { limit: 25, sort: { createdAt: -1 } },
  });

  if (!conversation) {
    return res.status(404).json({ message: 'Conversation not found.' });
  }

  res.status(200).json({ conversation });
});

module.exports = {
  getAllConversations,
  createConversation,
  getConversationDetails,
};
