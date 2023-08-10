# Nodebird 배포

## AWS 배포 전 준비하기
- 서버 실행 관리, 에러 내역 관리, 보안 위협 대처
- AWS와 GCP에 배포

1. morgan('dev') => morgan('combined'); // ip를 기록할 수 있게 바꾸어 줌
2. env는 뒤에 cross-env에서 설정해줌
3. express-session 수정 -> 개발용 옵션에서 배포일 때만 값을 바꾸어주도록 수정
[ex]
const helmet = require('helmet'); // 서버 요청 관련 보안을 책임져줌
const hpp = require('hpp');       // 서버 요청 관련 보안을 책임져줌
...
// { contentSecurityPolicy: false } : content들 로딩 시 외부 css, script 로딩할 때 에러 남
app.use(helmet({ contentSecurityPolicy: false }));
app.use(hpp());
app.enable('trust proxy') // proxy 서버 사용 시 설정
...
session.proxy = true // proxy 서버 사용 시 설정
session.cookie.secure = true // https 프로토콜 적용시 사용

4. sequelize 설정도 하드코딩 대신 process.env로 변경
- config.json을 config.js로 바꾸어 process.env 사용

5. process.env 설정
**동적으로 process.env 변경 가능**
- package.json : "start": "NODE_ENV=production PORT=80 node server"

6. XSS(Cross Site Scripting) 공격방어
- npm i sanitize-html
- 허용하지 않은 html 입력을 막음(외부에서 직접 html 태그 넣어줄 때)
- 아래처럼 빈 문자열로 치환됨
const sanitizeHtml = require('sanitize-html');

const html = "<script>location.href = 'https://gilbut.co.kr'</script>";
console.log(sanitizeHtml(html)); // ''

7. CSRF(Cross Site Request Forgery) 공격 방어
- npm i csurf
- csrfToken을 생성해서 프런트로 보내주고(쿠키로)
- Form 등록 시 csrfToken을 같이 받아 일치하는지 비교