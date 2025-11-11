const axios = require('axios');
const CLERK_API_URL = process.env.CLERK_API_URL || 'https://api.clerk.dev';
const CLERK_SECRET = process.env.CLERK_SECRET_KEY;

let clerkSdkClient = null;
try {
  // Attempt to initialize official Clerk SDK client if available
  const { Clerk } = require('@clerk/clerk-sdk-node');
  clerkSdkClient = new Clerk({ apiKey: CLERK_SECRET });
} catch (e) {
  // SDK not available or failed to initialize — we'll fall back to REST
  clerkSdkClient = null;
}

/**
 * verifySession: Verify a Clerk session token using official SDK when possible,
 * otherwise fall back to calling Clerk's REST verify endpoint.
 * Returns clerk payload (SDK or REST shape) on success or throws an error.
 */
async function verifySession(sessionToken) {
  if (!CLERK_SECRET) {
    throw new Error('CLERK_SECRET_KEY is not configured on the server');
  }

  if (!sessionToken) {
    throw new Error('Missing Clerk session token');
  }

  // Prefer SDK verification if available
  if (clerkSdkClient && clerkSdkClient.sessions && typeof clerkSdkClient.sessions.verifySessionToken === 'function') {
    try {
      // SDK method may be named verifySessionToken or verify; try common names
      const fn = clerkSdkClient.sessions.verifySessionToken.bind(clerkSdkClient.sessions);
      const session = await fn(sessionToken);
      return session;
    } catch (err) {
      // Fall through to REST fallback
      console.warn('Clerk SDK verify failed, falling back to REST verify:', err.message || err);
    }
  }

  // REST fallback
  try {
    const url = `${CLERK_API_URL}/v1/sessions/verify`;
    const resp = await axios.post(
      url,
      { session_token: sessionToken },
      {
        headers: {
          Authorization: `Bearer ${CLERK_SECRET}`,
          'Content-Type': 'application/json'
        },
        timeout: 5000
      }
    );

    if (resp && (resp.data || resp)) return resp.data || resp;
    throw new Error('Invalid response from Clerk REST verify');
  } catch (err) {
    const msg = err?.response?.data || err.message || 'clerk verify error';
    const e = new Error('Clerk verification failed: ' + JSON.stringify(msg));
    e.original = err;
    throw e;
  }
}

module.exports = {
  verifySession
};
