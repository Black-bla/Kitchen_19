const mongoose = require('mongoose');
const { Schema } = mongoose;

const groupSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['institution', 'faculty', 'school', 'department', 'course', 'year'], required: true },
  institution: { type: Schema.Types.ObjectId, ref: 'Institution', required: true },
  parentGroup: { type: Schema.Types.ObjectId, ref: 'Group' },
  faculty: String,
  school: String,
  department: String,
  course: { type: Schema.Types.ObjectId, ref: 'Course' },
  yearOfStudy: Number,
  members: [{ user: { type: Schema.Types.ObjectId, ref: 'User' }, role: String, joinedAt: Date }],
  admins: [{ type: Schema.Types.ObjectId, ref: 'Admin' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Group', groupSchema);
