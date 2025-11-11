const mongoose = require('mongoose');
const { Schema } = mongoose;

const courseSchema = new Schema({
  name: { type: String, required: true },
  code: String,
  institution: { type: Schema.Types.ObjectId, ref: 'Institution', required: true },
  department: String,
  duration: Number,
  description: String,
  createdBy: { type: Schema.Types.ObjectId, ref: 'Admin' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Course', courseSchema);
