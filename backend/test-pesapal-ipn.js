require('dotenv').config();
const { registerIPNUrl } = require('./src/services/pesapal.service');

(async () => {
  try {
    const result = await registerIPNUrl();
    console.log('Pesapal IPN registration response:', result);
    process.exit(0);
  } catch (err) {
    console.error('Pesapal IPN registration failed:', err.response ? err.response.data : err.message);
    process.exit(1);
  }
})();
