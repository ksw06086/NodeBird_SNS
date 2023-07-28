const passport = require('passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy'); 
const User = require('../models/user');

module.exports = () => {
    passport.serializeUser((user, done) => { // user === exUser
        done(null, user.id); // user id만 추출
    });
    // 세션 : { 123456789: 1 } == { 세션쿠키: 유저아이디 } -> 메모리 저장됨 
    // 세션메모리에 유저 정보 다 저장하기에는 너무 많아서 메모리가 커지기에 id만 추출해서 넣는 것
    // 배포시에는 공유 메모리 저장소를 따로 두어서 그곳에 저장함

    passport.deserializeUser((id, done) => {
        User.findOne({where: {id}})
            .then((user) => done(null, user))
            .catch((err) => done(err));
    });

    local();
}