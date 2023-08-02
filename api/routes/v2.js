const express = require('express');
const { verifyToken, apiLimiter } = require('../middlewares');
const { tokenTest, createToken, getMyPosts, getPostsByHashtag, corsWhenDomainMatches } = require('../controllers/v2');
const cors = require('cors');
const router = express.Router();

// (req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4000');
//     res.setHeader('Access-Control-Allow-Headers', 'content-type');
//     next();
// }
router.use(corsWhenDomainMatches);

// /v1/token
router.post('/token', apiLimiter, createToken); // req.body.clientSecret
router.get('/test', verifyToken, apiLimiter, tokenTest);
// 나의 게시글 가져가는 API
router.get('/posts/my', verifyToken, apiLimiter, getMyPosts);
// 해시태그 관련 게시글 가져가는 API
router.get('/posts/hashtag/:title', verifyToken, apiLimiter, getPostsByHashtag);

module.exports = router;