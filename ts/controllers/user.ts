import { RequestHandler } from 'express';
import Post from '../models/post';
import User from '../models/user';
import { follow as followService } from '../services/user';

const update: RequestHandler = async (req, res, next) => {
    // req.user.id, req.body.nick
    try {
        console.log(req.body);
        const user = await User.findOne({ where: {id: req.user?.id }});
        if(user) { // user가 없을 수도 있으니까
            await User.update({
                nick: req.body.nick,
            }, {
                where: { id: req.user?.id }
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

const follow: RequestHandler = async (req, res, next) => {
    // req.user.id, req.params.id
    const result = await followService(req.user!.id, req.params.id);
    try {
        const user = await User.findOne({ where: {id: req.user?.id }});
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

const followCancel: RequestHandler = async (req, res, next) => {
    // req.user.id, req.params.id
    try {
        const user = await User.findOne({ where: {id: req.user?.id }});
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

const like: RequestHandler = async (req, res, next) => {
    // req.user.id, req.params.id
    try {
        const user = await User.findOne({ where: {id: req.user?.id }});
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

const likeCancel: RequestHandler = async (req, res, next) => {
    // req.user.id, req.params.id
    try {
        const user = await User.findOne({ where: {id: req.user?.id }});
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

export { update, follow, followCancel, like, likeCancel };