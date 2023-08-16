import Sequelize from 'sequelize';
// initiate, associate 까먹음 방지 위한 자동화(모델안의 모든 모델을 읽어서 해줌)
import configObj from '../config/config';
import User from './user';
import Post from './post';
import Hashtag from './hashtag';

// DB와 연결
const env = process.env.NODE_ENV as 'production' | 'test' || 'development';
const config = configObj[env];
const sequelize = new Sequelize.Sequelize(
  config.database, config.username, config.password, config,
);

User.initiate(sequelize);
Post.initiate(sequelize);
Hashtag.initiate(sequelize);

User.associate();
Post.associate();
Hashtag.associate();

module.exports = { User, Post, Hashtag, sequelize };