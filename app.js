const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks'); // 풀스텍을 원한다면 리액트,뷰로
const dotenv = require('dotenv');
const passport = require('passport');
const helmet = require('helmet');
const hpp = require('hpp');
const redis = require('redis');
const RedisStore = require('connect-redis')(session);
const { sequelize } = require('./models'); // 시퀄라이즈 가져오기

dotenv.config(); // process.env를 .env 파일과 연결 및 적용시켜줌
const redisClient = redis.createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    password: process.env.REDIS_PASSWORD,
    legacyMode: true,
});
redisClient.connect().catch(console.error);
const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');
const passportConfig = require('./passport'); // passport 가져오기

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

// dev : 자세하게 log 찍어줌 , 배포시 combined : 자세하지 않음(자세할수록 서버 용량 많이 잡아먹음)
if(process.env.NODE_ENV === 'production'){
    app.use(helmet({ // 기본으로 두면 너무 엄격함
        // 의미는 공식 문서
        contentSecurityPolicy: false,
        crossOriginEnbedderPolicy: false,
        crossOriginResourcePolicy: false,
    }));
    app.use(hpp());
    app.use(morgan('combined'));
} else {
    app.use(morgan('dev')); 
}
app.use(express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, 'uploads'))); // 해당 실행을 /img 경로에서만 실행
app.use(express.json()); // req.body를 ajax json 요청으로부터
app.use(express.urlencoded({ extended: false })); // req.body 폼으로부터
app.use(cookieParser(process.env.COOKIE_SECRET)); // { connect.sid: 123456789 } 이렇게 cookieParser가 객체로 만들어줌
const sessionOption = {
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,  // 자바스크립트에서 접근 못하게
        secure: false,   // https 적용할 때에는 true로 바꿔야함
    },
    store: new RedisStore({ client: redisClient }),
};
if(process.env.NODE_ENV === 'production'){
    sessionOption.proxy = true;
}
app.use(session(sessionOption));
// passport는 무조건 session 아래에
// 1. passport에서 세션쿠키를 가지고 유저아이디를 찾고 
// 2. deserializeUser를 실행시켜 req에 user를 저장해서 가지고 다님 
// 3. 세션쿠키 찾을 때 req.session도 함께 생성됨
// 4. 그래서 다음부터는 서버 실행시 req.user로 값을 줄 수 있음
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

module.exports = app;