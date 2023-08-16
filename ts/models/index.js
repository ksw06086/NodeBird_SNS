"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = __importDefault(require("sequelize"));
// initiate, associate 까먹음 방지 위한 자동화(모델안의 모든 모델을 읽어서 해줌)
const config_1 = __importDefault(require("../config/config"));
const user_1 = __importDefault(require("./user"));
const post_1 = __importDefault(require("./post"));
const hashtag_1 = __importDefault(require("./hashtag"));
// DB와 연결
const env = process.env.NODE_ENV || 'development';
const config = config_1.default[env];
const sequelize = new sequelize_1.default.Sequelize(config.database, config.username, config.password, config);
user_1.default.initiate(sequelize);
post_1.default.initiate(sequelize);
hashtag_1.default.initiate(sequelize);
user_1.default.associate();
post_1.default.associate();
hashtag_1.default.associate();
module.exports = { User: user_1.default, Post: post_1.default, Hashtag: hashtag_1.default, sequelize };
