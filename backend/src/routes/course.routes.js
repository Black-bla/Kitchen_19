const router = require('express').Router();
const ctrl = require('../controllers/course.controller');
const auth = require('../middleware/auth.middleware');

router.post('/', auth, ctrl.create);
router.get('/', ctrl.list);

module.exports = router;
