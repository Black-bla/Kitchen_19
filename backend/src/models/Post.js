const mongoose = require('mongoose');
const { Schema } = mongoose;

const postSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  media: [{ type: { type: String, enum: ['image', 'video'] }, url: String }],
  isEvent: { type: Boolean, default: false },
  eventDetails: { title: String, date: Date, location: String, institution: { type: Schema.Types.ObjectId, ref: 'Institution' } },
  visibility: { type: String, enum: ['public', 'institution', 'group'], default: 'public' },
  group: { type: Schema.Types.ObjectId, ref: 'Group' },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  comments: [{ user: { type: Schema.Types.ObjectId, ref: 'User' }, content: String, createdAt: { type: Date, default: Date.now } }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', postSchema);
