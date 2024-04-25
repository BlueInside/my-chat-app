const mongoose = require('mongoose');
const { Schema } = mongoose;

const conversationSchema = new Schema(
  {
    lastMessage: { type: Schema.Types.ObjectId, ref: 'Message' }, // References the latest sent message
    participants: [
      { type: Schema.Types.ObjectId, ref: 'User', required: true },
    ],
    messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
  },
  { timestamps: true }
);

conversationSchema.pre('save', function (next) {
  if (this.participants && this.participants.length < 2) {
    next(
      new Error('There must be at least 2 participants in the conversation.')
    );
  } else {
    next();
  }
});
module.exports = mongoose.model('Conversation', conversationSchema);
