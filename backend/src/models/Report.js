const mongoose = require('mongoose');
const { Schema } = mongoose;

const reportSchema = new Schema({
  reportedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  reportType: { type: String, enum: ['admin_abuse', 'inappropriate_content', 'harassment', 'spam', 'other'], required: true },
  targetType: { type: String, enum: ['user', 'post', 'marketplace_item', 'admin'], required: true },
  targetId: { type: Schema.Types.ObjectId, required: true },
  description: { type: String, required: true },
  evidence: [String],
  status: { type: String, enum: ['pending', 'under_review', 'resolved', 'dismissed'], default: 'pending' },
  reviewedBy: { type: Schema.Types.ObjectId, ref: 'Admin' },
  resolution: String,
  resolvedAt: Date,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', reportSchema);
