const express = require('express');
const { isLoggedIn } = require('../middlewares');
const { update, follow, followCancel, like, likeCancel } = require('../controllers/user');
const router = express.Router();
const multer = require('multer');

const upload = multer();
router.patch('/update', isLoggedIn, upload.none(), update);
router.post('/:id/follow', isLoggedIn, follow);
router.post('/:id/follow/cancel', isLoggedIn, followCancel);
router.post('/:id/like', isLoggedIn, like);
router.post('/:id/like/cancel', isLoggedIn, likeCancel);

module.exports = router;