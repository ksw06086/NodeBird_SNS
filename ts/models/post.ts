import Sequelize, { Model, CreationOptional } from 'sequelize';
import Hashtag from './hashtag';
import User from './user';

class Post extends Model {
    declare id: CreationOptional<number>;
    declare content: string;
    declare img: string;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    static initiate(sequelize: Sequelize.Sequelize) {
        Post.init({
            content: {
                type: Sequelize.STRING(140),
                allowNull: false,
            },
            img: {
                type: Sequelize.STRING(200),
                allowNull: true,
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            paranoid: false,
            modelName: 'Post',
            tableName: 'posts',
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }

    static associate() {
        Post.belongsTo(User);
        Post.belongsToMany(Hashtag, { through: 'PostHashtag' });
        Post.belongsToMany(User, { through: 'PostLike' });
    }
}

export default Post;