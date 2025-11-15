require('dotenv').config();
const admin = require('firebase-admin');

try {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)),
  });
  console.log('Firebase initialized. Project ID:', admin.app().options.credential.projectId);
  process.exit(0);
} catch (error) {
  console.error('Firebase initialization failed:', error);
  process.exit(1);
}
