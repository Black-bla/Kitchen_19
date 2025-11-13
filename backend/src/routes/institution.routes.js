const router = require('express').Router();
const ctrl = require('../controllers/institution.controller');
const auth = require('../middleware/auth.middleware');

router.post('/', auth, ctrl.create);
router.get('/', ctrl.list);
router.get('/:id', ctrl.get);
router.put('/:id', auth, ctrl.update);

module.exports = router;
