const mongoose = require('mongoose');
const { Schema } = mongoose;

const timetableSchema = new Schema({
  group: { type: Schema.Types.ObjectId, ref: 'Group', required: true },
  yearOfStudy: Number,
  semester: Number,
  academicYear: Number,
  schedule: [{ day: String, subject: { type: Schema.Types.ObjectId, ref: 'Subject' }, lecturer: { type: Schema.Types.ObjectId, ref: 'Lecturer' }, startTime: String, endTime: String, location: String, isOnline: Boolean }],
  createdBy: { type: Schema.Types.ObjectId, ref: 'Admin' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Timetable', timetableSchema);
