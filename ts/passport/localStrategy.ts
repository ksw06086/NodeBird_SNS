import passport from 'passport';
import { Strategy as localStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import User from '../models/user';

export default () => {
    passport.use(new localStrategy({
        usernameField: 'email', // req.body.email
        passwordField: 'password', // req.body.password
        passReqToCallback: false,  // true : 다음 함수가 (req, email, password, done), false : 다음 함수가 (email, password, done)
    }, async (email, password, done) => {
        try {
            const exUser = await User.findOne({ where: { email }}); // 이메일 관련된 유저 데이터 가져오기
            if(exUser){
                const result = await bcrypt.compare(password, exUser.password); // 사용자가 입력한 비번과 DB의 비번이 맞는지 확인
                if(result) { // 일치하다면
                    // done(서버실패, 성공유저, 로직실패)
                    done(null, exUser);
                } else {
                    done(null, false, { message: '비밀번호가 일치하지 않습니다.' })
                }
            } else {
                done(null, false, { message: '가입되지 않은 회원입니다.' })
            }
        } catch (error) {
            console.error(error);
            done(error);
        }
    }));
}