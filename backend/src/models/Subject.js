const mongoose = require('mongoose');
const { Schema } = mongoose;

const subjectSchema = new Schema({
  name: { type: String, required: true },
  code: String,
  course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  yearOfStudy: Number,
  semester: Number,
  lecturer: { type: Schema.Types.ObjectId, ref: 'Lecturer' },
  syllabus: String,
  courseOutline: String,
  documents: [{ type: Schema.Types.ObjectId, ref: 'Document' }],
  aiChatEnabled: { type: Boolean, default: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'Admin' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Subject', subjectSchema);
