"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const express_session_1 = __importDefault(require("express-session"));
const nunjucks_1 = __importDefault(require("nunjucks")); // 풀스텍을 원한다면 리액트,뷰로
const dotenv_1 = __importDefault(require("dotenv"));
const passport_1 = __importDefault(require("passport"));
dotenv_1.default.config(); // process.env를 .env 파일과 연결 및 적용시켜줌
const page_1 = __importDefault(require("./routes/page"));
const auth_1 = __importDefault(require("./routes/auth"));
const post_1 = __importDefault(require("./routes/post"));
const user_1 = __importDefault(require("./routes/user"));
const models_1 = require("./models"); // 시퀄라이즈 가져오기
const passport_2 = __importDefault(require("./passport")); // passport 가져오기
// 미들웨어 설정
const app = (0, express_1.default)();
(0, passport_2.default)(); // passport 미들웨어 설정
app.set('port', process.env.PORT || 8001);
app.set('view engine', 'html');
nunjucks_1.default.configure('views', {
    express: app,
    watch: true,
});
// 개발시 테이블 잘못 만들었다면 sync( { force: true } ) 하면 테이블 다 날라갔다가 다시 생성됨
models_1.sequelize.sync({})
    .then(() => {
    console.log('데이터베이스 연결 성공');
})
    .catch((err) => {
    console.error(err);
});
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use('/img', express_1.default.static(path_1.default.join(__dirname, 'uploads'))); // 해당 실행을 /img 경로에서만 실행
app.use(express_1.default.json()); // req.body를 ajax json 요청으로부터
app.use(express_1.default.urlencoded({ extended: false })); // req.body 폼으로부터
app.use((0, cookie_parser_1.default)(process.env.COOKIE_SECRET)); // { connect.sid: 123456789 } 이렇게 cookieParser가 객체로 만들어줌
app.use((0, express_session_1.default)({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false, // https 적용할 때에는 true로 바꿔야함
    },
}));
app.use(passport_1.default.initialize()); // req.user, req.login, req.isAuthenticated, req.logout
app.use(passport_1.default.session()); // connect.sid라는 이름으로 세션 쿠키가 브라우저로 전송
// 브라우저 connect.sid=123456789 세션 이렇게 저장됨
app.use('/', page_1.default);
app.use('/auth', auth_1.default);
app.use('/post', post_1.default);
app.use('/user', user_1.default);
app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
});
app.use((err, req, res, next) => {
    res.locals.message = err.message;
    // 배포모드가 아니라면 에러 출력, 맞다면 에러 출력 X => 보안위함
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {}; // 에러 로그를 서비스한테 넘기고 사용자에게 보여주진 않음
    res.status(err.status || 500);
    res.render('error');
});
exports.default = app;
