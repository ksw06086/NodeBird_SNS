import passport from 'passport';
import local from './localStrategy';
import kakao from './kakaoStrategy'; 
import User from '../models/user';
import Post from '../models/post';

export default () => {
    passport.serializeUser((user, done) => { // user === exUser
        done(null, user.id); // user id만 추출
    });
    // 세션 : { 123456789: 1 } == { 세션쿠키: 유저아이디 } -> 메모리 저장됨 
    // 세션메모리에 유저 정보 다 저장하기에는 너무 많아서 메모리가 커지기에 id만 추출해서 넣는 것
    // 배포시에는 공유 메모리 저장소를 따로 두어서 그곳에 저장함

    passport.deserializeUser((id: number, done) => {
        User.findOne({
                where: {id},
                include: [
                    { 
                        model : Post,
                        attributes: ['id'],
                        as: 'likePost',
                    },
                    {
                        model: User,
                        attributes: ['id', 'nick'],
                        as: 'Followers',
                    }, // 팔로잉
                    {
                        model: User,
                        attributes: ['id', 'nick'],
                        as: 'Followings',
                    }, // 팔로워
                ],
            })
            .then((user) => done(null, user))
            .catch((err) => done(err));
    });

    local();
    kakao();
};