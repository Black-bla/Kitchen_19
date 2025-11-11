const router = require('express').Router();
const ctrl = require('../controllers/attendance.controller');

router.post('/create', ctrl.createSession);
router.post('/:id/generate-qr', ctrl.generateQr);

module.exports = router;
