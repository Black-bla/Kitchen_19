const router = require('express').Router();
const ctrl = require('../controllers/notification.controller');
const auth = require('../middleware/auth.middleware');
const notificationService = require('../services/notification.service');

router.post('/', auth, ctrl.create);
router.get('/my-notifications', auth, ctrl.myNotifications);

// Test routes for notification service
router.post('/test-send', auth, async (req, res) => {
  try {
    const { token, title, body, data } = req.body;
    const result = await notificationService.send({ token, title, body, data });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/test-send-multiple', auth, async (req, res) => {
  try {
    const { tokens, title, body, data } = req.body;
    const result = await notificationService.sendToMultiple(tokens, { title, body, data });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
