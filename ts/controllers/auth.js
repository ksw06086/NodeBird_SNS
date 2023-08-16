"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.join = void 0;
const user_1 = __importDefault(require("../models/user"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const passport_1 = __importDefault(require("passport"));
const join = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { nick, email, password } = req.body;
    try {
        const exUser = yield user_1.default.findOne({ where: { email } });
        if (exUser) {
            return res.redirect('/join?error=exist');
        }
        const hash = yield bcrypt_1.default.hash(password, 12); // 비밀번호 암호화(숫자 높을수록 보안에 좋지만 느려짐)
        yield user_1.default.create({
            email,
            nick,
            password: hash,
        });
        return res.redirect('/');
    }
    catch (error) {
        console.error(error);
        next(error);
    }
});
exports.join = join;
// POST /auth/login
const login = (req, res, next) => {
    // localStrategy.js 불러옴 localStrategy.js에서 done으로 보내준게 다음 함수로 보내짐
    // authError : 서버에러, user : 성공유저, info : 로직에러
    passport_1.default.authenticate('local', (authError, user, info) => {
        if (authError) {
            console.error(authError);
            return next(authError);
        }
        if (!user) {
            return res.redirect(`/?loginError=${info.message}`);
        }
        return req.login(user, (loginError) => {
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        });
    })(req, res, next);
};
exports.login = login;
const logout = (req, res, next) => {
    req.logout(() => {
        res.redirect('/');
    });
};
exports.logout = logout;
