const router = require('express').Router();
const ctrl = require('../controllers/ai.controller');
const auth = require('../middleware/auth.middleware');

router.post('/chat', auth, ctrl.chat);
router.post('/process-admission', auth, ctrl.processAdmission);

module.exports = router;
