import Sequelize, { Model, CreationOptional } from 'sequelize';
import Post from './post';

class User extends Model {
    declare id: CreationOptional<number>;
    declare email: string;
    declare nick: string;
    declare password: string;
    declare provider: string;
    declare snsId: string;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare deletedAt: CreationOptional<Date>; 

    static initiate(sequelize: Sequelize.Sequelize){
        User.init({
            email: {
                type: Sequelize.STRING(40),
                allowNull: true,
                unique: true,
            },
            nick: {
                type: Sequelize.STRING(15),
                allowNull: false,
            },
            password: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            provider: { // ENUM : 제한을 두는 것 'local', 'kakao' 둘 중 하나만 넣을 수 있음
                type: Sequelize.ENUM('local', 'kakao'),
                allowNull: false,
                defaultValue: 'local',
            },
            snsId: {
                type: Sequelize.STRING(30),
                allowNull: true,
            }
        }, {
            // validation : 저장하기 전 검사(이 컬럼, 저 컬럼 둘 중 하나는 값이 있는지)
            sequelize,
            timestamps: true, // createdAt, updatedAt
            underscored: false,
            modelName: 'User',
            tableName: 'users',
            paranoid: true, // deletedAt 유저 삭제일
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate() {
        User.hasMany(Post);
        User.belongsToMany(Post, { 
            foreignKey: 'likePostId',
            as: 'likePost',
            through: 'PostLike' 
        });
        User.belongsToMany(User, { // 팔로워 : 나를 팔로잉하고 있는 사람 찾기
            foreignKey: 'followingId',
            as: 'Followers',
            through: 'Follow'
        })
        User.belongsToMany(User, { // 팔로잉 : 내가 팔로잉하고 있는 사람 찾기
            foreignKey: 'followerId',
            as: 'Followings',
            through: 'Follow'
        });
    }
}

export default User;