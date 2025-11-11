const mongoose = require('mongoose');
const { Schema } = mongoose;

const lecturerSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  firstName: String,
  lastName: String,
  employeeId: String,
  phoneNumber: String,
  institution: { type: Schema.Types.ObjectId, ref: 'Institution' },
  department: String,
  subjects: [{ type: Schema.Types.ObjectId, ref: 'Subject' }],
  specialization: String
});

module.exports = mongoose.model('Lecturer', lecturerSchema);
