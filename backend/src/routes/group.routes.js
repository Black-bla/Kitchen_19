const router = require('express').Router();
const ctrl = require('../controllers/group.controller');
const auth = require('../middleware/auth.middleware');

router.post('/', auth, ctrl.create);
router.get('/', auth, ctrl.getAll);
router.get('/my-groups', auth, ctrl.myGroups);
router.get('/:id', auth, ctrl.getById);
router.put('/:id', auth, ctrl.update);
router.delete('/:id', auth, ctrl.delete);

router.post('/:id/members', auth, ctrl.addMember);
router.delete('/:id/members/:memberId', auth, ctrl.removeMember);

module.exports = router;
