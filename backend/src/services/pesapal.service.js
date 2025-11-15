const OAuth = require('oauth-1.0a');
const crypto = require('crypto');
const axios = require('axios');

const PESAPAL_CONSUMER_KEY = process.env.PESAPAL_CONSUMER_KEY;
const PESAPAL_CONSUMER_SECRET = process.env.PESAPAL_CONSUMER_SECRET;
const PESAPAL_API_BASE = process.env.PESAPAL_API_BASE || 'https://pay.pesapal.com/v3';
const PESAPAL_CALLBACK_URL = process.env.PESAPAL_CALLBACK_URL;

let pesapalToken = null;
let pesapalTokenExpiry = null;

async function getAccessToken() {
  if (pesapalToken && pesapalTokenExpiry && pesapalTokenExpiry > Date.now()) {
    return pesapalToken;
  }
  const url = `${PESAPAL_API_BASE}/api/Auth/RequestToken`;
  const body = {
    consumer_key: PESAPAL_CONSUMER_KEY,
    consumer_secret: PESAPAL_CONSUMER_SECRET
  };
  const res = await axios.post(url, body, { headers: { 'Content-Type': 'application/json' } });
  pesapalToken = res.data.token;
  pesapalTokenExpiry = Date.now() + (res.data.expires_in || 3599) * 1000;
  return pesapalToken;
}

async function initiatePayment({ amount, description, reference, email, phone, currency = 'KES' }) {
  const token = await getAccessToken();
  const body = {
    amount,
    description,
    reference,
    currency,
    callback_url: PESAPAL_CALLBACK_URL,
    email,
    phone_number: phone,
  };
  const url = `${PESAPAL_API_BASE}/api/Transactions/SubmitOrderRequest`;
  const res = await axios.post(url, body, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });
  return res.data;
}

async function queryPaymentStatus({ orderTrackingId }) {
  const token = await getAccessToken();
  const url = `${PESAPAL_API_BASE}/api/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`;
  const res = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.data;
}

async function registerIPNUrl() {
  const token = await getAccessToken();
  const url = `${PESAPAL_API_BASE}/api/URLSetup/RegisterIPN`;
  const body = {
    url: PESAPAL_CALLBACK_URL,
    ipn_notification_type: 'POST',
  };
  const res = await axios.post(url, body, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });
  return res.data;
}

module.exports = {
  getAccessToken,
  initiatePayment,
  queryPaymentStatus,
  registerIPNUrl,
};
