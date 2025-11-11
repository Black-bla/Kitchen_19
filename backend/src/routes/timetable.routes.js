const router = require('express').Router();
const ctrl = require('../controllers/timetable.controller');
const auth = require('../middleware/auth.middleware');

router.post('/', auth, ctrl.create);
router.get('/group/:groupId', auth, ctrl.getByGroup);

module.exports = router;
