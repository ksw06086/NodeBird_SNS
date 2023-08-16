import passport from 'passport';
import { Strategy as KakaoStrategy } from 'passport-kakao';
import User from '../models/user';

export default () => {
    passport.use(new KakaoStrategy({
        clientID: process.env.KAKAO_ID!,
        callbackURL: '/auth/kakao/callback', 
    }, async (accessToken, refreshToken, profile, done) => {
        // accessToken, refreshToken은 카카오API 호출 시 사용됨
        console.log('profile', profile);
        try {
            const exUser = await User.findOne({
                where: { snsId: profile.id, provider: 'kakao' }
            });
            if (exUser) {
                done(null, exUser);
            } else {
                const newUser = await User.create({
                    email: profile._json?.kakao_account?.email,
                    nick: profile.displayName,
                    snsId: profile.id,
                    provider: 'kakao',
                });
                done(null, newUser);
            }   
        } catch (error) {
            console.error(error);
            done(error);
        }
    }));
};