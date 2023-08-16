const { isLoggedIn, isNotLoggedIn } = require('./');

describe('isLoggedIn', () => {
    const res = {
        // 메서드 체이닝
        status: jest.fn(() => res),
        send: jest.fn(),
    }
    const next = jest.fn(); // 횟수를 세야하기 때문에 jest.fn()를 쓰면 횟수를 셀 수 있음
    test('로그인되어 있으면 isLoggedIn이 next를 호출해야 함', () => {
        const req = {
            isAuthenticated: jest.fn(() => { return true; }),
        }
        // 사실상 여기 req, res, next가 값이 전달받아오지 못해서 무조건 에러가 남
        // 그래서 Mocking 가짜로 생성을 해줌
        isLoggedIn(req, res, next);
        expect(next).toBeCalledTimes(1);
    });
    
    test('로그인되어 있지 않으면 isLoggedIn이 에러를 응답해야 함', () => {
        const req = {
            isAuthenticated: jest.fn(() => { return false; }),
        }
        isLoggedIn(req, res, next);
        expect(res.status).toBeCalledWith(403);
        expect(res.send).toBeCalledWith('로그인 필요');
    });    
})

describe('isNotLoggedIn', () => {
    const res = {
        redirect: jest.fn(),
    }
    const next = jest.fn();
    test('로그인되어 있으면 isNotLoggedIn이 에러를 응답해야 함', () => {
        const req = {
            isAuthenticated: jest.fn(() => { return true; }),
        }
        isNotLoggedIn(req, res, next);
        const message = encodeURIComponent('로그인한 상태입니다.');
        expect(res.redirect).toBeCalledWith(`/?error=${message}`);
    });
    
    test('로그인되어 있지 않으면 isNotLoggedIn이 next를 호출해야 함', () => {
        const req = {
            isAuthenticated: jest.fn(() => { return false; }),
        }
        isNotLoggedIn(req, res, next);
        expect(next).toBeCalledTimes(1);
    });    
})
