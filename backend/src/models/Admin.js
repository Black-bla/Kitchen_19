const mongoose = require('mongoose');
const { Schema } = mongoose;

const adminSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  adminType: { type: String, enum: ['class_rep', 'course_coordinator', 'timetable_maker', 'faculty_admin', 'main_admin'], required: true },
  institution: { type: Schema.Types.ObjectId, ref: 'Institution' },
  group: { type: Schema.Types.ObjectId, ref: 'Group' },
  permissions: [String],
  electedAt: Date,
  termEndsAt: Date
});

module.exports = mongoose.model('Admin', adminSchema);
