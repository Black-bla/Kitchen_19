const router = require('express').Router();
const ctrl = require('../controllers/assignment.controller');

router.post('/', ctrl.create);
router.get('/', ctrl.submissions);

module.exports = router;
