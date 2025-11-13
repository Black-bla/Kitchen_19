const router = require('express').Router();
const ctrl = require('../controllers/timetable.controller');
const auth = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');
const { timetableSchemas } = require('../utils/validators');

router.post('/', auth, validate(timetableSchemas.create), ctrl.create);
router.get('/', ctrl.getAll);
router.get('/:id', validate(timetableSchemas.objectId), ctrl.getById);
router.get('/group/:groupId', auth, validate(timetableSchemas.objectId), ctrl.getByGroup);
router.put('/:id', auth, validate(timetableSchemas.update), ctrl.update);
router.delete('/:id', auth, validate(timetableSchemas.objectId), ctrl.delete);

module.exports = router;
