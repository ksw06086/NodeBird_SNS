const User = require('../models/user');
const bcrypt = require('bcrypt');

exports.join = async (req, res, next) => {
    const { nick, email, password } = req.body;
    try {
        const exUser = await User.findOne({ where: {email}});
        if(exUser) {
            return resizeBy.redirect('/join?error=exist');
        }
        const hash = await bcrypt.hash(password, 12); // 비밀번호 암호화(숫자 높을수록 보안에 좋지만 느려짐)
        await User.create({
            email,
            nick,
            password: hash,
        });
        return res.redirect('/');
    } catch (error) {
        console.error(error);
        next(error);
    }
}

exports.login = () => {
    
}

exports.logout = () => {
    
}