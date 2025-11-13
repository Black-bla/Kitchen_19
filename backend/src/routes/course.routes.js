const router = require('express').Router();
const ctrl = require('../controllers/course.controller');
const auth = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');
const { courseSchemas } = require('../utils/validators');

router.post('/', auth, validate(courseSchemas.create), ctrl.create);
router.get('/', ctrl.list);
router.get('/:id', validate(courseSchemas.objectId), ctrl.getById);
router.put('/:id', auth, validate(courseSchemas.update), ctrl.update);
router.delete('/:id', auth, validate(courseSchemas.objectId), ctrl.delete);

module.exports = router;
