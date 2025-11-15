const router = require('express').Router();
const auth = require('../middleware/auth.middleware');
const emailService = require('../services/email.service');
const geolocationService = require('../services/geolocation.service');

// Test routes for various services
router.post('/test-email', async (req, res) => {
  try {
    const { to, subject, html } = req.body;
    const result = await emailService.sendEmail({ to: 'ianmutunga009@gmail.com', subject: 'Test Email', html: '<h1>This is a test email from kitchen19 backend</h1>' });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/test-geolocation', auth, async (req, res) => {
  try {
    const { point, center, radius } = req.body;
    const result = geolocationService.isWithinRadius(point, center, radius);
    const distance = geolocationService.getDistance(point, center);
    res.json({ isWithinRadius: result, distance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;