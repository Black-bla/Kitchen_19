const router = require('express').Router();
const ctrl = require('../controllers/notification.controller');

router.post('/', ctrl.create);
router.get('/my-notifications', ctrl.myNotifications);

module.exports = router;
