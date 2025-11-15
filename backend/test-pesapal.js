require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');
const User = require('./src/models/User');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    const user = await User.findOne();
    if (!user) throw new Error('No user found in database');

    const payload = {
      amount: 100,
      description: 'Test Payment',
      reference: 'test-ref-001',
      email: user.email || 'test@example.com',
      phone: '+254700000000',
      currency: 'KES',
      userId: user._id.toString()
    };

    try {
      const res = await axios.post('http://localhost:4000/api/payments/pesapal/initiate', payload);
      console.log('Pesapal initiate response:', res.data);
    } catch (err) {
      if (err.response) {
        console.error('Pesapal API error:', err.response.data);
      } else {
        console.error('Pesapal test failed:', err.message);
      }
      process.exit(1);
    }
    process.exit(0);
  } catch (err) {
    console.error('Pesapal test failed:', err.message);
    process.exit(1);
  }
})();
