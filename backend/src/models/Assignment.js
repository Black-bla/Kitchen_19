const mongoose = require('mongoose');
const { Schema } = mongoose;

const assignmentSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  type: { type: String, enum: ['assignment', 'CAT', 'exam'], required: true },
  subject: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
  group: { type: Schema.Types.ObjectId, ref: 'Group' },
  dueDate: { type: Date, required: true },
  totalMarks: Number,
  attachments: [String],
  submissions: [{ student: { type: Schema.Types.ObjectId, ref: 'Student' }, submittedAt: Date, fileUrl: String, marks: Number, feedback: String }],
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Assignment', assignmentSchema);
