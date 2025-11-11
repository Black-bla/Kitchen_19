const router = require('express').Router();
const ctrl = require('../controllers/document.controller');
const auth = require('../middleware/auth.middleware');

router.post('/', auth, ctrl.upload);
router.get('/:id', auth, ctrl.get);

module.exports = router;
