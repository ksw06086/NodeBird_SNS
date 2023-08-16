"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const localStrategy_1 = __importDefault(require("./localStrategy"));
const kakaoStrategy_1 = __importDefault(require("./kakaoStrategy"));
const user_1 = __importDefault(require("../models/user"));
const post_1 = __importDefault(require("../models/post"));
exports.default = () => {
    passport_1.default.serializeUser((user, done) => {
        done(null, user.id); // user id만 추출
    });
    // 세션 : { 123456789: 1 } == { 세션쿠키: 유저아이디 } -> 메모리 저장됨 
    // 세션메모리에 유저 정보 다 저장하기에는 너무 많아서 메모리가 커지기에 id만 추출해서 넣는 것
    // 배포시에는 공유 메모리 저장소를 따로 두어서 그곳에 저장함
    passport_1.default.deserializeUser((id, done) => {
        user_1.default.findOne({
            where: { id },
            include: [
                {
                    model: post_1.default,
                    attributes: ['id'],
                    as: 'likePost',
                },
                {
                    model: user_1.default,
                    attributes: ['id', 'nick'],
                    as: 'Followers',
                },
                {
                    model: user_1.default,
                    attributes: ['id', 'nick'],
                    as: 'Followings',
                }, // 팔로워
            ],
        })
            .then((user) => done(null, user))
            .catch((err) => done(err));
    });
    (0, localStrategy_1.default)();
    (0, kakaoStrategy_1.default)();
};
