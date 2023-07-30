const express = require('express');
const { isLoggedIn } = require('../middlewares');
const { follow, followCancel } = require('../controllers/user');
const router = express.Router();

router.post('/:id/follow', isLoggedIn, follow);
router.post('/:id/follow/cancel', isLoggedIn, followCancel);

module.exports = router;