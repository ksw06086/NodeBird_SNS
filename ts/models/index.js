const Sequelize = require('sequelize');
// initiate, associate 까먹음 방지 위한 자동화(모델안의 모든 모델을 읽어서 해줌)
const fs = require('fs');
const path = require('path');

// DB와 연결
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};
const sequelize = new Sequelize(
  config.database, config.username, config.password, config,
);
db.sequelize = sequelize;

// process.cwd() : C:~지금폴더까지의 절대경로
// path.basename : 마지막 폴더명|파일명 빼내기
const basename = path.basename(__filename); // index.js
fs.readdirSync(__dirname) // models
    .filter(file => { // models 안에 있는 파일들이 읽힘
      // 숨김파일, index.js, 확장자 .js 아닌거 제외
      return file.indexOf('.') !== 0 && !file.includes('test') && file !== basename && file.slice(-3) === '.js'; 
    })
    .forEach((file) => {
      const model = require(path.join(__dirname, file));
      console.log(model);
      console.log(file, model.name); // 클래스 네임이 뜸
      db[model.name] = model;
      model.initiate(sequelize);
    });

Object.keys(db).forEach(modelName => {
  console.log(db, modelName);
  if(db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;