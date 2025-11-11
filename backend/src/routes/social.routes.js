const router = require('express').Router();
const ctrl = require('../controllers/social.controller');

router.post('/posts', ctrl.createPost);
router.get('/posts', ctrl.feed);

module.exports = router;
