const { isLoggedIn, isNotLoggedIn } = require('./');

describe('isLoggedIn', () => {
    test('로그인되어 있으면 isLoggedIn이 next를 호출해야 함', () => {
        const res = {
            status: jest.fn(() => res),
            send: jest.fn(),
        }
        const req = {
            isAuthenticated: jest.fn(() => { return true; }),
        }
        const next = jest.fn(); // 횟수를 세야하기 때문에 jest.fn()를 쓰면 횟수를 셀 수 있음
        // 사실상 여기 req, res, next가 값이 전달받아오지 못해서 무조건 에러가 남
        // 그래서 Mocking 가짜로 생성을 해줌
        isLoggedIn(req, res, next);
        expect(next).toBeCalledTimes(1);
    });
    
    test('로그인되어 있지 않으면 isLoggedIn이 에러를 응답해야 함', () => {
        const res = {
            status: jest.fn(() => res),
            send: jest.fn(),
        }
        const req = {
            isAuthenticated: jest.fn(() => { return false; }),
        }
        const next = jest.fn(); // 횟수를 세야하기 때문에 jest.fn()를 쓰면 횟수를 셀 수 있음
        // 사실상 여기 req, res, next가 값이 전달받아오지 못해서 무조건 에러가 남
        // 그래서 Mocking 가짜로 생성을 해줌
        isLoggedIn(req, res, next);
        expect(res.status).toBeCalledWith(403);
        expect(res.send).toBeCalledWith('로그인 필요');
    });    
})

describe('isLoggedIn', () => {
    test('로그인되어 있으면 isNotLoggedIn이 에러를 응답해야 함', () => {
        expect().toEqual();
    });
    
    test('로그인되어 있지 않으면 isNotLoggedIn이 next를 호출해야 함', () => {
        expect().toEqual();
    });    
})
