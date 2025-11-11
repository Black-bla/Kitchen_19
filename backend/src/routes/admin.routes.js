const router = require('express').Router();
const ctrl = require('../controllers/admin.controller');

router.get('/pending-institutions', ctrl.pendingInstitutions);
router.put('/institutions/:id/approve', ctrl.approveInstitution);

module.exports = router;
