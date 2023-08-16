import express from 'express';
import { renderJoin, renderMain, renderProfile, renderHashtag } from '../controllers/page';
import { isLoggedIn, isNotLoggedIn } from '../middlewares';
import Post from '../models/post';
const router = express.Router();

router.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.likeCount = req.user?.likePost?.length || 0;
    res.locals.likePostIdList = req.user?.likePost?.map(f => f.id) || [];
    console.log(req.user, res.locals.likePostIdList, res.locals.likeCount);
    res.locals.followerCount = req.user?.Followers?.length || 0;
    res.locals.followingCount = req.user?.Followings?.length || 0;
    res.locals.followingIdList = req.user?.Followings?.map(f => f.id) || [];
    next();
})

router.get('/profile', isLoggedIn, renderProfile);  // 프로필 보기
router.get('/join', isNotLoggedIn, renderJoin);     // 회원가입
router.get('/', renderMain);                        // 메인화면
router.get('/hashtag', renderHashtag);              // hashtag?hashtag=고양이

export default router;