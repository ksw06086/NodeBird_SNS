const app = require('../app');
const request = require('supertest');
const { sequelize } = require('../models');

// 우리가 서버를 실행시킨 것이 아니기 때문에 DB와 연결이 안되어있을 수 있음
// 그래서 테스트 실행 전 DB와 연결해야할 때
beforeAll( async () => { // 모든 테스드들이 실행되기 전에 딱 1번만 실행되는 함수
    await sequelize.sync({ force: true });
})

beforeEach(() => { // n번 마다 테스트 실행 전에 1번씩 실행되는 함수

})

describe('POST /join', () => {
    test('로그인 안 했으면 가입', (done) => {
        request(app).post('/auth/join')
            .send({
                email: `ksw06086@naver.com`,
                nick: `swkim`,
                password: `1234`,
            })
            .expect('Location', '/')
            .expect(302, done);
    })
    test('회원가입 이미 했는데 또 하는 경우', (done) => {
        request(app).post('/auth/join')
            .send({
                email: `ksw06086@naver.com`,
                nick: `swkim`,
                password: `1234`,
            })
            .expect('Location', '/join?error=exist')
            .expect(302, done);
    })
})

describe('POST /join', () => {
    // beforeEach와 test 안에 request(app)이 서로 다를 수 있기에 변수를 선언해서 하나로 묶어줌
    const agent = request.agent(app);
    // beforeEach를 위에 describe에 붙이면 모두에게 영향이 감 그래서 따로 빼준 것
    beforeEach((done) => {
        // 로그인 해줌
        agent.post('/auth/login')
            .send({
                email: `ksw06086@naver.com`,
                password: `1234`,
            })
            .end(done);
    })
    test('로그인 진행했으면 회원가입이 안 되어야 함', (done) => {
        const message = encodeURIComponent('로그인한 상태입니다.');
        agent.post('/auth/join')
            .send({
                email: `ksw06086@naver.com`,
                nick: `swkim`,
                password: `1234`,
            })
            .expect('Location', `/?error=${message}`)
            .expect(302, done);
    })
})

describe('POST /login', () => {
    test('로그인 수행', (done) => {
        // request는 비동기임 -> 언제 끝날지를 jest가 알지 못함
        // service 부분에서 다뤘지만 거기는 Promise였기에 async await으로 해결했었음
        // 그 때는 done()을 호출해주면 jest가 테스트가 끝났다는 것을 알아차림. 아래처럼 해줘도 됨
        request(app).post('/auth/login')
            .send({
                email: `ksw06086@naver.com`,
                password: `1234`,
            })
            .expect('Location', '/')
            .expect(302, done);
    })
    test('가입되지 않은 회원', (done) => {
        const message = encodeURIComponent('가입되지 않은 회원입니다.');
        request(app).post('/auth/login')
            .send({
                email: `ksw060861@naver.com`,
                password: `1234`,
            })
            .expect('Location', `/login?Error=${message}`)
            .expect(302, done);
    })
    test('비밀번호 틀림', (done) => {
        const message = encodeURIComponent('비밀번호가 일치하지 않습니다.');
        request(app).post('/auth/login')
            .send({
                email: `ksw06086@naver.com`,
                password: `1`,
            })
            .expect('Location', `/login?Error=${message}`)
            .expect(302, done);
    })
})

describe('GET /logout', () => {
    test('로그인 되어있지 않으면 403', (done) => {
      request(app)
        .get('/auth/logout')
        .expect(403, done);
    });
  
    const agent = request.agent(app);
    beforeEach((done) => {
      agent
        .post('/auth/login')
        .send({
          email: 'ksw06086@naver.com',
          password: '1234',
        })
        .end(done);
    });
  
    test('로그아웃 수행', (done) => {
      agent
        .get('/auth/logout')
        .expect('Location', `/`)
        .expect(302, done);
    });
});


afterEach(() => { // n번 마다 테스트 실행 후에 1번씩 실행되는 함수

})

// 모든 테스트가 끝난 후 실행되는 함수
afterAll(() => {})