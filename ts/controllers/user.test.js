// DB 접근 시 가짜 만드는 법
jest.mock('../models/user');
const User = require('../models/user');
const { follow } = require('./user');

// 테스트는 분기가 나뉘어지는 기준으로 짠다.
describe('follow', () => {
    test('사용자를 찾아 팔로잉을 추가하고 success를 응답해야 함', async () => {
        const res = {
            send: jest.fn(),
        }
        const req = {
            user: { id:1 },
            params: { id:2 },
        };
        const next = jest.fn();
        // 가짜 DB 함수 사용법
        User.findOne.mockReturnValue({
            addFollowing(id) {
                return Promise.resolve(true);
            },
        })
        await follow(req, res, next);
        expect(res.send).toBeCalledWith('success');
    });
    test('사용자를 못 찾으면 res.status(404).send(no user)를 호출함', async () => {
        const res = {
            status: jest.fn(() => res),
            send: jest.fn(),
        }
        const req = {
            user: { id:1 },
            params: { id:2 },
        };
        const next = jest.fn();
        User.findOne.mockReturnValue(null);
        await follow(req, res, next)
        expect(res.status).toBeCalledWith(404);
        expect(res.send).toBeCalledWith('no user');
    });
    test('DB에서 에러가 발생하면 next(error)를 호출함', async () => {
        const req = {
            user: { id:1 },
            params: { id:2 },
        };
        const res = {};
        const next = jest.fn();
        const message = 'DB에러';
        User.findOne.mockReturnValue(Promise.reject(message));
        try {
            await follow(req, res, next);
        } catch (error) {
            expect(error).toEqual(message);
        }
    });
});