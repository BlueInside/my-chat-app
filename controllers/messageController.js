const Message = require('../models/message');
const Conversation = require('../models/conversation');
const asyncHandler = require('express-async-handler');

const getMessageById = asyncHandler(async (req, res, next) => {
  const message = await Message.findById(req.params.id);

  if (!message) {
    return res.status(404).json({ message: 'Message not found' });
  }

  res.status(200).json({ message: message });
});

const sendMessage = asyncHandler(async (req, res, next) => {
  const { receiverId } = req.body;

  // Create message
  const message = await Message.create({
    receiver: receiverId,
    sender: req.user.id,
    text: req.body.text,
    type: req.body.type || 'text',
  });

  // Create conversation
  const conversation = await Conversation.findOne({
    participants: { $all: [receiverId, req.user.id] },
  });

  //  No conversation, create new
  if (!conversation) {
    const newConversation = await Conversation.create({
      lastMessage: message.id,
      participants: [receiverId, req.user.id],
      messages: [message.id],
    });

    await newConversation.save();
  } else if (conversation) {
    // Push message
    conversation.messages.push(message.id);

    // Change last message
    conversation.lastMessage = message.id;

    await conversation.save();
  }

  res.status(201).json({ message: 'Message sent successfully', data: message });
});

const deleteMessage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const userRole = req.user.role;

  // Get message to check ownership
  const message = await Message.findById(id);

  if (!message) {
    return res.status(404).json({ message: 'Message not found.' });
  }

  // If user is not a sender or admin don't allow to remove message
  if (message.sender.toString() !== userId && userRole !== 'admin') {
    return res.status(403).json({
      message: 'Access denied: You can only delete your own messages.',
    });
  }

  const deletedMessage = await Message.findByIdAndDelete(id);

  // Delete message from conversation model
  await Conversation.updateMany({ messages: id }, { $pull: { messages: id } });

  // Return response with deleted message
  res.status(200).json({
    message: `Message ${id} successfully deleted.`,
    data: deletedMessage,
  });
});

module.exports = { getMessageById, sendMessage, deleteMessage };
