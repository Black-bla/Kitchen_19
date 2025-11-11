const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  authProvider: { type: String, enum: ['google', 'facebook', 'apple', 'test'], required: true },
  authId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['student', 'lecturer', 'admin', 'main_admin'], required: true },
  profileComplete: { type: Boolean, default: false },
  isPremium: { type: Boolean, default: false },
  premiumExpiresAt: Date,
  avatar: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
