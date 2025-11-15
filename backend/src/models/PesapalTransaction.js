const mongoose = require('mongoose');

const PesapalTransactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reference: { type: String, required: true },
  orderTrackingId: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'KES' },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  paymentMethod: { type: String, default: 'pesapal' },
  meta: { type: Object },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

PesapalTransactionSchema.index({ reference: 1, orderTrackingId: 1 });

module.exports = mongoose.model('PesapalTransaction', PesapalTransactionSchema);
