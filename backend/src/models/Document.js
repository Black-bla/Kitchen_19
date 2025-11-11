const mongoose = require('mongoose');
const { Schema } = mongoose;

const documentSchema = new Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['pdf', 'doc', 'video', 'image', 'link'], required: true },
  url: String,
  fileSize: Number,
  subject: { type: Schema.Types.ObjectId, ref: 'Subject' },
  uploadedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  aiProcessed: { type: Boolean, default: false },
  aiEmbeddings: [Number],
  description: String,
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Document', documentSchema);
