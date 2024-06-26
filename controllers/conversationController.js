const Conversation = require('../models/conversation');
const asyncHandler = require('express-async-handler');

const getAllConversations = asyncHandler(async (req, res) => {
  // Use jwt payload to get userId
  const userId = req.user.id;
  const conversations = await Conversation.find({
    participants: userId,
  })
    .populate('participants', 'username avatarUrl')
    .populate('lastMessage', 'text');

  res.status(200).json({ conversations: conversations });
});

const createConversation = asyncHandler(async (req, res) => {
  // USE JWT
  const senderId = req.user.id;
  const { receiverId } = req.body;

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
      return res.status(409).json({ message: 'Conversation already exists.' });
    } else {
      return next(error);
    }
  }
});

const getConversationDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const senderId = req.user.id;
  const conversation = await Conversation.findById(id)
    .populate({
      path: 'messages',
      options: { limit: 25, sort: { createdAt: -1 } },
    })
    .populate({ path: 'participants', select: 'username avatarUrl' });

  if (!conversation) {
    return res.status(404).json({ message: 'Conversation not found.' });
  }

  // Verify that user is part of the conversation
  if (!conversation.participants.some((u) => u._id.toString() === senderId)) {
    return res
      .status(403)
      .json({ message: 'User not authorized to view these messages' });
  }

  res.status(200).json({ conversation });
});

module.exports = {
  getAllConversations,
  createConversation,
  getConversationDetails,
};
