const express = require('express');
const router = express.Router();
const { renderJoin, renderMain, renderProfile, renderHashtag } = require('../controllers/page');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const Post = require('../models/post');

router.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.followerCount = req.user?.Followers?.length || 0;
    res.locals.followingCount = req.user?.Followings?.length || 0;
    res.locals.followingIdList = req.user?.Followings?.map(f => f.id) || [];
    next();
})

router.get('/profile', isLoggedIn, renderProfile);  // 프로필 보기
router.get('/join', isNotLoggedIn, renderJoin);     // 회원가입
router.get('/', renderMain);                        // 메인화면
router.get('/hashtag', renderHashtag);              // hashtag?hashtag=고양이

module.exports = router;