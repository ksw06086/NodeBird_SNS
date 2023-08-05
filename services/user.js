// 서비스는 req, res를 몰라야한다.
const User = require('../models/user');

exports.follow = async (userId, followingId) => {
    const user = await User.findOne({ where: { id: userId } });
    if(user){
        await user.addFollowing(parseInt(followingId, 10));
        return 'ok';
    } else {
        return 'no user';
    }
}