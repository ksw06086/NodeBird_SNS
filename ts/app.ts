import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import session from 'express-session';
import nunjucks from 'nunjucks'; // 풀스텍을 원한다면 리액트,뷰로

import dotenv from 'dotenv';
import passport from 'passport';

dotenv.config(); // process.env를 .env 파일과 연결 및 적용시켜줌
import pageRouter from './routes/page';
import authRouter from './routes/auth';
import postRouter from './routes/post';
import userRouter from './routes/user';
import { sequelize } from './models'; // 시퀄라이즈 가져오기
import passportConfig from './passport'; // passport 가져오기

// 미들웨어 설정
const app = express();
passportConfig(); // passport 미들웨어 설정
app.set('port', process.env.PORT || 8001);
app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
    watch: true,
});
// 개발시 테이블 잘못 만들었다면 sync( { force: true } ) 하면 테이블 다 날라갔다가 다시 생성됨
sequelize.sync({})
    .then(() => {
        console.log('데이터베이스 연결 성공');
    })
    .catch((err) => {
        console.error(err);
    });

app.use(morgan('dev')); 
app.use(express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, 'uploads'))); // 해당 실행을 /img 경로에서만 실행
app.use(express.json()); // req.body를 ajax json 요청으로부터
app.use(express.urlencoded({ extended: false })); // req.body 폼으로부터
app.use(cookieParser(process.env.COOKIE_SECRET)); // { connect.sid: 123456789 } 이렇게 cookieParser가 객체로 만들어줌
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET!,
    cookie: {
        httpOnly: true,  // 자바스크립트에서 접근 못하게
        secure: false,   // https 적용할 때에는 true로 바꿔야함
    },
}));
app.use(passport.initialize()); // req.user, req.login, req.isAuthenticated, req.logout
app.use(passport.session()); // connect.sid라는 이름으로 세션 쿠키가 브라우저로 전송
// 브라우저 connect.sid=123456789 세션 이렇게 저장됨

app.use('/', pageRouter);
app.use('/auth', authRouter);
app.use('/post', postRouter);
app.use('/user', userRouter);


app.use((req, res, next) => { // 404 Not Found Error
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
});
app.use((err, req, res, next) => {
    res.locals.message = err.message;
    // 배포모드가 아니라면 에러 출력, 맞다면 에러 출력 X => 보안위함
    res.locals.error = process.env.NODE_ENV !== 'production' ? err: {}; // 에러 로그를 서비스한테 넘기고 사용자에게 보여주진 않음
    res.status(err.status || 500);
    res.render('error');
});

export default app;