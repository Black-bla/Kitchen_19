const mongoose = require('mongoose');
const { Schema } = mongoose;

const studentSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  admissionLetter: String,
  studentId: String,
  firstName: String,
  lastName: String,
  phoneNumber: String,
  institution: { type: Schema.Types.ObjectId, ref: 'Institution' },
  faculty: String,
  school: String,
  department: String,
  course: { type: Schema.Types.ObjectId, ref: 'Course' },
  yearOfStudy: Number,
  enrollmentDate: Date,
  groups: [{ type: Schema.Types.ObjectId, ref: 'Group' }],
  storageUsed: { type: Number, default: 0 },
  storageLimit: { type: Number, default: 500 }
});

module.exports = mongoose.model('Student', studentSchema);
