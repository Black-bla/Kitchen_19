const mongoose = require('mongoose');
const { Schema } = mongoose;

const marketplaceSchema = new Schema({
  seller: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  title: { type: String, required: true },
  description: String,
  category: { type: String, enum: ['books', 'electronics', 'clothing', 'services', 'other'] },
  price: { type: Number, required: true },
  currency: { type: String, default: 'KES' },
  images: [String],
  condition: { type: String, enum: ['new', 'used', 'refurbished'] },
  status: { type: String, enum: ['available', 'sold', 'reserved'], default: 'available' },
  institution: { type: Schema.Types.ObjectId, ref: 'Institution' },
  location: String,
  contactInfo: { phone: String, email: String, preferredContact: { type: String, enum: ['phone', 'email', 'inapp'] } },
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Marketplace', marketplaceSchema);
