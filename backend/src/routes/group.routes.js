const router = require('express').Router();
const ctrl = require('../controllers/group.controller');
const auth = require('../middleware/auth.middleware');

router.post('/', auth, ctrl.create);
router.get('/my-groups', auth, ctrl.myGroups);

module.exports = router;
