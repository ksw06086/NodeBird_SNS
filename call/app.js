const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks'); // 풀스텍을 원한다면 리액트,뷰로
const dotenv = require('dotenv');

dotenv.config(); // process.env를 .env 파일과 연결 및 적용시켜줌
const indexRouter = require('./routes');
const app = express();

app.set('port', process.env.PORT || 4000);
app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
    watch: true,
});

// dev : 자세하게 log 찍어줌 , 배포시 combined : 자세하지 않음(자세할수록 서버 용량 많이 잡아먹음)
app.use(morgan('dev')); 
app.use(express.json()); // req.body를 ajax json 요청으로부터
app.use(express.urlencoded({ extended: false })); // req.body 폼으로부터
app.use(cookieParser(process.env.COOKIE_SECRET)); // { connect.sid: 123456789 } 이렇게 cookieParser가 객체로 만들어줌
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,  // 자바스크립트에서 접근 못하게
        secure: false,   // https 적용할 때에는 true로 바꿔야함
    }
}));

app.use('/', indexRouter);

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

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
});