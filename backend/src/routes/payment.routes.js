const router = require('express').Router();
const auth = require('../middleware/auth.middleware');
const paymentService = require('../services/payment.service');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Test routes for payment service
router.post('/test-subscribe', auth, async (req, res) => {
  try {
    const { plan } = req.body;
    const result = await paymentService.subscribe(req.user.id, plan);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/test-cancel', auth, async (req, res) => {
  try {
    const result = await paymentService.cancelSubscription(req.user.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/test-status', auth, async (req, res) => {
  try {
    const result = await paymentService.getSubscriptionStatus(req.user.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Stripe webhook endpoint
router.post('/webhook', async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    const result = await paymentService.handleWebhook(event);
    res.json(result);
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;