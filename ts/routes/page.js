"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const page_1 = require("../controllers/page");
const middlewares_1 = require("../middlewares");
const router = express_1.default.Router();
router.use((req, res, next) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    res.locals.user = req.user;
    res.locals.likeCount = ((_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.likePost) === null || _b === void 0 ? void 0 : _b.length) || 0;
    res.locals.likePostIdList = ((_d = (_c = req.user) === null || _c === void 0 ? void 0 : _c.likePost) === null || _d === void 0 ? void 0 : _d.map(f => f.id)) || [];
    console.log(req.user, res.locals.likePostIdList, res.locals.likeCount);
    res.locals.followerCount = ((_f = (_e = req.user) === null || _e === void 0 ? void 0 : _e.Followers) === null || _f === void 0 ? void 0 : _f.length) || 0;
    res.locals.followingCount = ((_h = (_g = req.user) === null || _g === void 0 ? void 0 : _g.Followings) === null || _h === void 0 ? void 0 : _h.length) || 0;
    res.locals.followingIdList = ((_k = (_j = req.user) === null || _j === void 0 ? void 0 : _j.Followings) === null || _k === void 0 ? void 0 : _k.map(f => f.id)) || [];
    next();
});
router.get('/profile', middlewares_1.isLoggedIn, page_1.renderProfile); // 프로필 보기
router.get('/join', middlewares_1.isNotLoggedIn, page_1.renderJoin); // 회원가입
router.get('/', page_1.renderMain); // 메인화면
router.get('/hashtag', page_1.renderHashtag); // hashtag?hashtag=고양이
exports.default = router;
