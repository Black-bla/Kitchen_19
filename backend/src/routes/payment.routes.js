const router = require('express').Router();
const auth = require('../middleware/auth.middleware');
const paymentService = require('../services/payment.service');
const pesapalController = require('../controllers/pesapal.controller');

// Initialize Stripe lazily
let stripe = null;
const getStripe = () => {
  if (!stripe && process.env.STRIPE_SECRET_KEY) {
    const Stripe = require('stripe');
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripe;
};

// Test routes for payment service
router.post('/test-subscribe', auth, async (req, res) => {
  try {
    const stripeClient = getStripe();
    if (!stripeClient) {
      return res.status(500).json({ error: 'Stripe not configured' });
    }

    const { plan } = req.body;
    const result = await paymentService.subscribe(req.user.id, plan);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/test-cancel', auth, async (req, res) => {
  try {
    const stripeClient = getStripe();
    if (!stripeClient) {
      return res.status(500).json({ error: 'Stripe not configured' });
    }

    const result = await paymentService.cancelSubscription(req.user.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/test-status', auth, async (req, res) => {
  try {
    const stripeClient = getStripe();
    if (!stripeClient) {
      return res.status(500).json({ error: 'Stripe not configured' });
    }

    const result = await paymentService.getSubscriptionStatus(req.user.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Stripe webhook endpoint
router.post('/webhook', async (req, res) => {
  try {
    const stripeClient = getStripe();
    if (!stripeClient) {
      return res.status(500).json({ error: 'Stripe not configured' });
    }

    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;
    try {
      event = stripeClient.webhooks.constructEvent(req.body, sig, endpointSecret);
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

// Pesapal payment endpoints
router.post('/pesapal/initiate', pesapalController.initiate);
router.get('/pesapal-callback', pesapalController.callback);
router.post('/pesapal-notify', pesapalController.notify);

module.exports = router;