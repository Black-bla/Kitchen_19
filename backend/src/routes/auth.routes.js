const router = require('express').Router();
const ctrl = require('../controllers/auth.controller');
const auth = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');
const { clerkLoginLimiter } = require('../middleware/rateLimiter.middleware');

router.post('/oauth', ctrl.oauth);
// protected upload endpoint (multipart form-data, field name 'file')
router.post('/upload-admission', auth, upload.single('file'), ctrl.uploadAdmission);
router.get('/me', auth, ctrl.me);

// Clerk login (client should post Clerk-verified user info)
router.post('/clerk-login', clerkLoginLimiter, ctrl.clerkLogin);

module.exports = router;
