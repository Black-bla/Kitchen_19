const router = require('express').Router();
const ctrl = require('../controllers/marketplace.controller');

router.post('/items', ctrl.createItem);
router.get('/items', ctrl.list);

module.exports = router;
