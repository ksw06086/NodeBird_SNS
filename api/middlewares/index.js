const jwt = require('jsonwebtoken');

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