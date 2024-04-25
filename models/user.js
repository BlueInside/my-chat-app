const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    fullName: { type: String, default: '' },
    bio: { type: String, default: '' },
    avatarUrl: { type: String },
    dateOfBirth: { type: Date },
    lastActive: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

module.exports = mongoose.model('User', userSchema);
