const router = require('express').Router();
const ctrl = require('../controllers/onlineClass.controller');

router.post('/', ctrl.schedule);
router.put('/:id/start', ctrl.start);

module.exports = router;
