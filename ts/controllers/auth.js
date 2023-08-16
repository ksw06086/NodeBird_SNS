const User = require('../models/user');
const bcrypt = require('bcrypt');
const passport = require('passport');

exports.join = async (req, res, next) => {
    const { nick, email, password } = req.body;
    try {
        const exUser = await User.findOne({ where: {email}});
        if(exUser) {
            return res.redirect('/join?error=exist');
        }
        const hash = await bcrypt.hash(password, 12); // 비밀번호 암호화(숫자 높을수록 보안에 좋지만 느려짐)
        await User.create({
            email,
            nick,
            password: hash,
        });
        return res.redirect('/');
    } catch (error) {
        console.error(error);
        next(error);
    }
}

// POST /auth/login
exports.login = (req, res, next) => {
    // localStrategy.js 불러옴 localStrategy.js에서 done으로 보내준게 다음 함수로 보내짐
    // authError : 서버에러, user : 성공유저, info : 로직에러
    passport.authenticate('local', (authError, user, info) => {
        if(authError){ // 서버에서
            console.error(authError);
            return next(authError);
        }
        if(!user) { // 로직실패
            return res.redirect(`/?Error=${info.message}`);
        }
        return req.login(user, (loginError) => { // 로그인 성공
            if(loginError){ 
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        });
    })(req, res, next);
}

exports.logout = (req, res, next) => { // { 123456789: 1 } 세션쿠키를 없애버림, 브라우저 connect.sid가 남아있어도 그 값이 없어져버림
    req.logout(() => {
        res.redirect('/');
    })
}