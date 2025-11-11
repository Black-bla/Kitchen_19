const mongoose = require('mongoose');
const { Schema } = mongoose;

const notificationSchema = new Schema({
  type: { type: String, enum: ['class_reminder', 'assignment', 'timetable_change', 'announcement', 'exam', 'general'], required: true },
  title: { type: String, required: true },
  message: String,
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  target: { type: { type: String, enum: ['individual', 'group'], required: true }, users: [{ type: Schema.Types.ObjectId, ref: 'User' }], group: { type: Schema.Types.ObjectId, ref: 'Group' } },
  scheduleRule: { type: { type: String, enum: ['immediate', 'before_class', 'before_due', 'scheduled'] }, minutesBefore: Number, scheduledAt: Date },
  relatedTo: { model: String, id: Schema.Types.ObjectId },
  read: [{ user: { type: Schema.Types.ObjectId, ref: 'User' }, readAt: Date }],
  sentAt: Date,
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);
