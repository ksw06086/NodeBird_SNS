const express = require('express');
const { verifyToken, deprecated } = require('../middlewares');
const { tokenTest, createToken, getMyPosts, getPostsByHashtag } = require('../controllers/v1');
const router = express.Router();

router.use(deprecated);

// /v1/token
router.post('/token', createToken); // req.body.clientSecret
router.get('/test', verifyToken, tokenTest);
// 나의 게시글 가져가는 API
router.get('/posts/my', verifyToken, getMyPosts);
// 해시태그 관련 게시글 가져가는 API
router.get('/posts/hashtag/:title', verifyToken, getPostsByHashtag);

module.exports = router;