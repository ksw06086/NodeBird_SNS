// 가장 핵심 구현 로직이 서비스 내의 로직들이기 때문에 이 부분만 테스트해도 반이상은 고장은 잘 안남
// 테스트 우선순위 : service(핵심로직) -> controller(요청, 응답, next) -> 다음들

// DB 접근 시 가짜 만드는 법
jest.mock('../models/user');
const User = require('../models/user');
const { follow } = require('./user');

// 테스트는 분기가 나뉘어지는 기준으로 짠다.
describe('follow', () => {
    test('사용자를 찾아 팔로잉을 추가하고 success를 응답해야 함', async () => {
        // 가짜 DB 함수 사용법
        User.findOne.mockReturnValue({
            addFollowing(id) {
                return Promise.resolve(true);
            },
        })
        const result = await follow(1, 2);
        expect(result).toEqual('ok');
    });
    test('사용자를 못 찾으면 res.status(404).send(no user)를 호출함', async () => {
        User.findOne.mockReturnValue(null);
        const result = await follow(1, 2);
        expect(result).toEqual('no user');
    });
    test('DB에서 에러가 발생하면 next(error)를 호출함', async () => {
        const message = 'DB에러';
        User.findOne.mockReturnValue(Promise.reject(message));
        try {
            await follow(1, 2);
        } catch (error) {
            expect(error).toEqual(message);
        }
    });
});