const Conversation = require('../models/conversation');
const asyncHandler = require('express-async-handler');
const isValid = require('mongoose').Types.ObjectId.isValid;
const getAllConversations = asyncHandler(async (req, res) => {
  // Use jwt payload to get userId
  const userId = 2;
  const conversations = await Conversation.find({ participants: userId });

  res.status(200).json({ conversations: conversations });
});

const createConversation = asyncHandler(async (req, res) => {
  // USE JWT

  const { senderId, receiverId } = req.body;

  //   Check if id's are correct mongoose ids
  if (!isValid(senderId) || !isValid(receiverId)) {
    return res
      .status(400)
      .json({ message: 'Either sender or receiver id is wrong.' });
  }

  if (senderId === receiverId) {
    return res
      .status(400)
      .json({ message: 'Sender and receiver cannot be the same.' });
  }

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
      res.status(409).json({ message: 'Conversation already exists' });
    } else {
      return next(error);
    }
  }
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
