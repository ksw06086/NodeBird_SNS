const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const User = require('../models/user');

// 로그인 했는지 판단
exports.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
        next();
    } else {
        res.status(403).send('로그인 필요');
    }
}

// 로그인 안했는지 판단
exports.isNotLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        next();
    } else {
        const message = encodeURIComponent('로그인한 상태입니다.');
        res.redirect(`/?error=${message}`); // localhost:8001?error=메시지
    }
}

exports.verifyToken = (req, res, next) => {
    try {
        res.locals.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
        return next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            res.status(419).json({
                code: 419,
                message: '토큰이 만료되었습니다.',
            });
        }
        return res.status(401).json({
            code: 401,
            message: '유효하지 않은 토큰입니다.',
        });
    }
}

// 실무에서는 우리가 보호해야할 서버 앞에 또다른 서버를 두어서 그 서버가 DDOS 공격을 받게 함
exports.apiLimiter = async (req, res, next) => {
    let user;
    if(res.locals.decoded){
        user = await User.findOne({ where: { id: res.locals.decoded.id } });
    }
    rateLimit({
        windowMs: 60*1000,
        max: user?.type === 'premium'? 1000 : 10,
        handler(req, res) {
            res.status(this.statusCode).json({
                code: this.statusCode,
                message: '1분에 10번만 요청할 수 있습니다.',
            });
        }
    })(req, res, next)
} 

exports.deprecated = (req, res) => {
    res.status(410).json({
        code: 410,
        message: '새로운 버전 나왔습니다. 새로운 버전을 사용하세요.',
    })
}

