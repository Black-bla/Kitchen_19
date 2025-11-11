const router = require('express').Router();
const ctrl = require('../controllers/ai.controller');
const auth = require('../middleware/auth.middleware');
const aiService = require('../services/ai.service');

router.post('/chat', auth, ctrl.chat);
router.post('/process-admission', auth, ctrl.processAdmission);

// Test routes for AI service
router.post('/test-ask', auth, async (req, res) => {
  try {
    const { prompt } = req.body;
    const result = await aiService.ask(prompt);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/test-process-document', auth, async (req, res) => {
  try {
    const { content, type } = req.body;
    const result = await aiService.processDocument(content, type);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
