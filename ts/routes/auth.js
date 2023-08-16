"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const auth_1 = require("../controllers/auth");
const middlewares_1 = require("../middlewares");
const router = express_1.default.Router();
// post /auth/join
router.post('/join', middlewares_1.isNotLoggedIn, auth_1.join);
// post /auth/login
router.post('/login', middlewares_1.isNotLoggedIn, auth_1.login);
// get  /auth/logout
router.get('/logout', middlewares_1.isLoggedIn, auth_1.logout);
// auth/kakao -> 카카오톡 로그인화면 -> auth/kakao/callback
// get /auth/kakao
router.get('/kakao', passport_1.default.authenticate('kakao')); // 카카오톡 로그인 화면으로 redirect
// get /auth/kakao/callback
router.get('/kakao/callback', passport_1.default.authenticate('kakao', {
    failureRedirect: '/?loginError=카카오로그인 실패',
}), (req, res) => {
    res.redirect('/');
});
exports.default = router;
