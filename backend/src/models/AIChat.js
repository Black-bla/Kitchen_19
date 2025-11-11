const mongoose = require('mongoose');
const { Schema } = mongoose;

const aiChatSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: Schema.Types.ObjectId, ref: 'Subject' },
  model: { type: String, enum: ['free', 'premium'], default: 'free' },
  messages: [{ role: { type: String, enum: ['user', 'assistant'] }, content: String, timestamp: { type: Date, default: Date.now } }],
  tokensUsed: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  lastMessageAt: Date
});

module.exports = mongoose.model('AIChat', aiChatSchema);
