const Stripe = require('stripe');
const User = require('../models/User');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_...');

const PLANS = {
  basic: { priceId: process.env.STRIPE_BASIC_PRICE_ID, amount: 9.99 },
  premium: { priceId: process.env.STRIPE_PREMIUM_PRICE_ID, amount: 19.99 }
};

module.exports = {
  // Create subscription
  subscribe: async (userId, plan = 'basic') => {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      if (!PLANS[plan]) {
        throw new Error('Invalid plan');
      }

      // Create or retrieve Stripe customer
      let customer;
      if (user.stripeCustomerId) {
        customer = await stripe.customers.retrieve(user.stripeCustomerId);
      } else {
        customer = await stripe.customers.create({
          email: user.email,
          metadata: { userId: userId.toString() }
        });
        user.stripeCustomerId = customer.id;
      }

      // Create subscription
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{
          price: PLANS[plan].priceId
        }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent']
      });

      // Update user
      user.isPremium = true;
      user.premiumExpiresAt = new Date(subscription.current_period_end * 1000);
      await user.save();

      return {
        success: true,
        subscriptionId: subscription.id,
        clientSecret: subscription.latest_invoice.payment_intent.client_secret,
        status: subscription.status
      };
    } catch (error) {
      console.error('Subscription creation failed:', error);
      return { success: false, error: error.message };
    }
  },

  // Cancel subscription
  cancelSubscription: async (userId) => {
    try {
      const user = await User.findById(userId);
      if (!user || !user.stripeCustomerId) {
        throw new Error('User or subscription not found');
      }

      // Find active subscription
      const subscriptions = await stripe.subscriptions.list({
        customer: user.stripeCustomerId,
        status: 'active'
      });

      if (subscriptions.data.length === 0) {
        throw new Error('No active subscription found');
      }

      // Cancel subscription
      const subscription = subscriptions.data[0];
      await stripe.subscriptions.update(subscription.id, {
        cancel_at_period_end: true
      });

      return { success: true, message: 'Subscription will be cancelled at period end' };
    } catch (error) {
      console.error('Subscription cancellation failed:', error);
      return { success: false, error: error.message };
    }
  },

  // Handle webhook events from Stripe
  handleWebhook: async (event) => {
    try {
      switch (event.type) {
        case 'invoice.payment_succeeded':
          // Payment successful, extend premium access
          const customerId = event.data.object.customer;
          const user = await User.findOne({ stripeCustomerId: customerId });
          if (user) {
            user.isPremium = true;
            user.premiumExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
            await user.save();
          }
          break;

        case 'invoice.payment_failed':
          // Payment failed, could notify user
          console.log('Payment failed for customer:', event.data.object.customer);
          break;

        case 'customer.subscription.deleted':
          // Subscription cancelled
          const cancelledCustomerId = event.data.object.customer;
          const cancelledUser = await User.findOne({ stripeCustomerId: cancelledCustomerId });
          if (cancelledUser) {
            cancelledUser.isPremium = false;
            cancelledUser.premiumExpiresAt = null;
            await cancelledUser.save();
          }
          break;
      }

      return { success: true };
    } catch (error) {
      console.error('Webhook handling failed:', error);
      return { success: false, error: error.message };
    }
  },

  // Get subscription status
  getSubscriptionStatus: async (userId) => {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      if (!user.stripeCustomerId) {
        return { isPremium: false, status: 'no_subscription' };
      }

      const subscriptions = await stripe.subscriptions.list({
        customer: user.stripeCustomerId,
        status: 'active'
      });

      return {
        isPremium: user.isPremium,
        expiresAt: user.premiumExpiresAt,
        hasActiveSubscription: subscriptions.data.length > 0,
        subscription: subscriptions.data[0] || null
      };
    } catch (error) {
      console.error('Get subscription status failed:', error);
      return { success: false, error: error.message };
    }
  }
};
