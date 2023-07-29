const express = require('express');
const passport = require('passport');
const { join, login, logout } = require('../controllers/auth');
const { isNotLoggedIn, isLoggedIn } = require('../middlewares');
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

module.exports = router;