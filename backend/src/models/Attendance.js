const mongoose = require('mongoose');
const { Schema } = mongoose;

const attendanceSchema = new Schema({
  subject: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
  group: { type: Schema.Types.ObjectId, ref: 'Group', required: true },
  lecturer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  classType: { type: String, enum: ['physical', 'online'], required: true },
  location: { lat: Number, lng: Number, radius: { type: Number, default: 100 } },
  qrCode: String,
  qrExpiry: Date,
  records: [{ student: { type: Schema.Types.ObjectId, ref: 'User' }, status: String, markedAt: Date, markedBy: String, excuseReason: String, location: { lat: Number, lng: Number } }],
  autoMarkTime: Date,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Attendance', attendanceSchema);
