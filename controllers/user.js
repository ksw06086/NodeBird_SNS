const User = require('../models/user');

exports.follow = async (req, res, next) => {
    // req.user.id, req.params.id
    try {
        const user = await User.findOne({ where: {id: req.user.id }});
        if(user) { // user가 없을 수도 있으니까
            await user.addFollowing(parseInt(req.params.id, 10));
            res.send('success');
        } else {
            res.status(404).send('no user');
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
};