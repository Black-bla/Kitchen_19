const router = require('express').Router();
const ctrl = require('../controllers/document.controller');
const auth = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

router.post('/', auth, upload.single('file'), ctrl.upload);
router.get('/', auth, ctrl.list);
router.get('/:id', auth, ctrl.get);
router.put('/:id', auth, ctrl.update);
router.delete('/:id', auth, ctrl.delete);

module.exports = router;
