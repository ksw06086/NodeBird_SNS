// 파일에 import 또는 export가 1개라도 있으면 모듈이라고 봄, 그래야 자동으로 인식
import IUser from '../models/user';

declare global { // ts 자료형들이 전역(-g)에 저장되어 있음 그래서 추가하는 것도 전역으로 해줌
    namespace Express {
        // tslint:disable-next-line:no-empty-interface
        // tslint:disable-next-line:no-empty-interface
        interface User extends IUser {}
    }

    interface Error {
        status: number;
    }
}
