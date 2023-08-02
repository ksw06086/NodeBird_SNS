const jwt = require('jsonwebtoken');
const cors = require('cors');
const { response } = require("express");
const { Domain, User, Hashtag, Post } = require("../models");

exports.createToken = async (req, res) => {
    const {clientSecret} = req.body;
    try {
        const domain = await Domain.findOne({
            where: { clientSecret },
            include: [{
                model: User,
                attributes: ['id', 'nick'],
            }]
        })
        if(!domain) {
            return response.status(401).json({
                code: 401,
                message: '등록되지 않은 도메인입니다. 먼저 도메인을 등록하세요.',
            })
        }
        const token = jwt.sign({
            id: domain.User.id,
            nick: domain.User.nick,
        }, process.env.JWT_SECRET, {
            expiresIn: '1m',
            issuer: 'nodebird',
        });
        return res.json({
            code: 200,
            message: '토큰 발급되었습니다.',
            token,
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code: 500,
            message: '서버 에러',
        });
    }
}

exports.tokenTest = (req, res, next) => {
    res.json(res.locals.decoded);
}

exports.getMyPosts = (req, res) => {
    Post.findAll({ where: { userId: res.locals.decoded.id } })
        .then((posts) => {
            res.json({
                code: 200,
                payload: posts,
            })
        })
        .catch((err) => {
            return res.status(500).json({
                code: 500,
                message: '서버 에러',
            })
        });
}

exports.getPostsByHashtag = async (req, res) => {
    try {
        const hashtag = await Hashtag.findOne({ where: {title: req.params.title } });
        if(!hashtag){
            return res.status(404).json({
                code: 404,
                message: '검색 결과가 없습니다.',
            })
        }
        const posts = await hashtag.getPosts();
        if(posts.length === 0) {
            return res.status(404).json({
                code: 404,
                message: '검색 결과가 없습니다.',
            })
        }
        return res.json({
            code: 200,
            payload: posts,
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code: 500,
            message: '서버 에러',
        })
    }
}

exports.corsWhenDomainMatches = async (req, res, next) => {
    const domain = await Domain.findOne({
        // new URL(url).host 하면 http, https 등이 떼어진 문자열이 됨
        where: { host: new URL(req.get('origin')).host },
    })
    if(domain) {
        cors({
            origin: req.get('origin'), // 'http://localhost:4000'
            credentials: true, // 쿠키도 같이 받아올 것이면 true해줌 하지만, true일 경우 origin은 *이 될 수 없음 대신 true를 넣어줌
        })(req, res, next)
    } else {
        next();
    }
}