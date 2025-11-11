const mongoose = require('mongoose');
const { Schema } = mongoose;

const onlineClassSchema = new Schema({
  subject: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
  group: { type: Schema.Types.ObjectId, ref: 'Group', required: true },
  lecturer: { type: Schema.Types.ObjectId, ref: 'Lecturer', required: true },
  title: String,
  scheduledAt: Date,
  startedAt: Date,
  endedAt: Date,
  status: { type: String, enum: ['scheduled', 'live', 'ended'], default: 'scheduled' },
  roomId: { type: String, unique: true },
  participants: [{ user: { type: Schema.Types.ObjectId, ref: 'User' }, joinedAt: Date, leftAt: Date }],
  recording: String,
  attendance: { type: Schema.Types.ObjectId, ref: 'Attendance' }
});

module.exports = mongoose.model('OnlineClass', onlineClassSchema);
