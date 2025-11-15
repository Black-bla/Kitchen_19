const pesapalService = require('../services/pesapal.service');
const PesapalTransaction = require('../models/PesapalTransaction');
const User = require('../models/User');

exports.initiate = async (req, res) => {
  try {
    const { amount, description, reference, email, phone, currency, userId } = req.body;
    const result = await pesapalService.initiatePayment({ amount, description, reference, email, phone, currency });
    // Save transaction to DB
    const orderTrackingId = result.orderTrackingId || result.order_tracking_id || result.order_trackingId || result.orderTrackingID || (result.data && (result.data.orderTrackingId || result.data.order_tracking_id));
    if (!orderTrackingId) {
      return res.status(500).json({ error: 'Pesapal did not return an orderTrackingId', pesapalResponse: result });
    }
    await PesapalTransaction.create({
      user: userId,
      reference,
      orderTrackingId,
      amount,
      currency: currency || 'KES',
      status: 'pending',
      meta: result
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.callback = async (req, res) => {
  const { orderTrackingId } = req.query;
  try {
    const status = await pesapalService.queryPaymentStatus({ orderTrackingId });
    // Update transaction in DB
    const tx = await PesapalTransaction.findOneAndUpdate(
      { orderTrackingId },
      { status: status.status || status.payment_status, meta: status, updatedAt: new Date() },
      { new: true }
    );
    // Optionally, update user premium status or order fulfillment here
    res.json({ status, transaction: tx });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.notify = async (req, res) => {
  const { orderTrackingId } = req.body;
  try {
    const status = await pesapalService.queryPaymentStatus({ orderTrackingId });
    // Update transaction in DB
    const tx = await PesapalTransaction.findOneAndUpdate(
      { orderTrackingId },
      { status: status.status || status.payment_status, meta: status, updatedAt: new Date() },
      { new: true }
    );
    // Optionally, update user premium status or order fulfillment here
    res.json({ status, transaction: tx });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
