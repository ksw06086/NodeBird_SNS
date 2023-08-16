import express from 'express';
import passport from 'passport';
import { join, login, logout } from '../controllers/auth';
import { isNotLoggedIn, isLoggedIn } from '../middlewares';
const router = express.Router();

// post /auth/join
router.post('/join', isNotLoggedIn, join);
// post /auth/login
router.post('/login', isNotLoggedIn, login);
// get  /auth/logout
router.get('/logout', isLoggedIn, logout);

// auth/kakao -> 카카오톡 로그인화면 -> auth/kakao/callback
// get /auth/kakao
router.get('/kakao', passport.authenticate('kakao')); // 카카오톡 로그인 화면으로 redirect
// get /auth/kakao/callback
router.get('/kakao/callback', passport.authenticate('kakao', {
    failureRedirect: '/?loginError=카카오로그인 실패',
}), (req, res) => {
    res.redirect('/');  
});

export default router;