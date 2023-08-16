const Post = require('../models/post');
const User = require('../models/user');
const { follow } = require('../services/user');

exports.update = async (req, res, next) => {
    // req.user.id, req.body.nick
    try {
        console.log(req.body);
        const user = await User.findOne({ where: {id: req.user.id }});
        if(user) { // user가 없을 수도 있으니까
            await User.update({
                nick: req.body.nick,
            }, {
                where: { id: req.user.id }
            });
            res.send('success');
        } else {
            res.status(404).send('no user');
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
};

exports.follow = async (req, res, next) => {
    // req.user.id, req.params.id
    const result = await follow(req.user.id, req.params.id);
    try {
        const user = await User.findOne({ where: {id: req.user.id }});
        if(result === 'ok') { // user가 없을 수도 있으니까
            res.send('success');
        } else if(result === 'no user') {
            res.status(404).send('no user');
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
};

exports.followCancel = async (req, res, next) => {
    // req.user.id, req.params.id
    try {
        const user = await User.findOne({ where: {id: req.user.id }});
        if(user) { // user가 없을 수도 있으니까
            await user.removeFollowing(parseInt(req.params.id, 10));
            res.send('success');
        } else {
            res.status(404).send('no user');
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
}

exports.like = async (req, res, next) => {
    // req.user.id, req.params.id
    try {
        const user = await User.findOne({ where: {id: req.user.id }});
        if(user) { // user가 없을 수도 있으니까
            await user.addLikePost(parseInt(req.params.id, 10));
            res.send('success');
        } else {
            res.status(404).send('no post');
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
};

exports.likeCancel = async (req, res, next) => {
    // req.user.id, req.params.id
    try {
        const user = await User.findOne({ where: {id: req.user.id }});
        if(user) { // user가 없을 수도 있으니까
            await user.removeLikePost(parseInt(req.params.id, 10));
            res.send('success');
        } else {
            res.status(404).send('no post');
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
}