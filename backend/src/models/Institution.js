const mongoose = require('mongoose');
const { Schema } = mongoose;

const institutionSchema = new Schema({
  name: { type: String, required: true },
  code: { type: String, unique: true },
  logo: String,
  website: String,
  country: String,
  approved: { type: Boolean, default: false },
  approvedBy: { type: Schema.Types.ObjectId, ref: 'Admin' },
  approvedAt: Date,
  academicCalendar: [{ year: Number, semester: Number, startDate: Date, endDate: Date }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Institution', institutionSchema);
