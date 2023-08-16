// 서비스는 req, res를 몰라야한다.
import User from '../models/user';

const follow = async (userId: number, followingId: string) => {
    const user = await User.findOne({ where: { id: userId } });
    if(user){
        await user.addFollowing(parseInt(followingId, 10));
        return 'ok';
    } else {
        return 'no user';
    }
}

export { follow };