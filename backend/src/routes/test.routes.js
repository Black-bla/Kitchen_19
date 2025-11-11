const router = require('express').Router();
const auth = require('../middleware/auth.middleware');
const emailService = require('../services/email.service');
const geolocationService = require('../services/geolocation.service');

// Test routes for various services
router.post('/test-email', auth, async (req, res) => {
  try {
    const { to, subject, html } = req.body;
    const result = await emailService.sendEmail({ to, subject, html });
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