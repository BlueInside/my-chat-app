const mongoose = require('mongoose');
const { Schema } = mongoose;

const conversationSchema = new Schema(
  {
    lastMessage: { type: Schema.Types.ObjectId, ref: 'Message' }, // References the latest sent message
    participants: [
      { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    ],
    messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
  },
  { timestamps: true }
);

// Make sure participants are always sorted and unique.
conversationSchema.index({ participants: 1 }, { unique: true });

//  Makes sure there's at least 2 participants in conversation
conversationSchema.pre('save', function (next) {
  if (this.participants && this.participants.length < 2) {
    next(
      new Error('There must be at least 2 participants in the conversation.')
    );
  } else {
    next();
  }
});

conversationSchema.pre('save', function (next) {
  // Sort participants so it's always in order A B
  if (this.participants) {
    this.participants.sort();
    next();
  }
});

module.exports = mongoose.model('Conversation', conversationSchema);
