const express = require('express');
const router = express.Router();
const { renderJoin, renderMain, renderProfile } = require('../controllers/page');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');

router.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.followerCount = 0;
    res.locals.followingCount = 0;
    res.locals.followingIdList = [];
    next();
})

router.get('/profile', isLoggedIn, renderProfile);  // 프로필 보기
router.get('/join', isNotLoggedIn, renderJoin);        // 회원가입
router.get('/', renderMain);            // 메인화면

module.exports = router;