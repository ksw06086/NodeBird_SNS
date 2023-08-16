import Sequelize, { Model, CreationOptional } from 'sequelize';
import Post from './post';

// title, timestamps(createdAt, updatedAt), id 
// => 생성되는 것들을 타입스크립트에게 알려주려면 따로 적어주어야 함
class Hashtag extends Model {
    // declare이면 타입스크립트가 타입 선언으로 인식
    declare id: CreationOptional<number>;
    declare title: string;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    static initiate(sequelize: Sequelize.Sequelize) {
        Hashtag.init({
            title: {
                type: Sequelize.STRING(15),
                allowNull: false,
                unique: true,
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Hashtag',
            tableName: 'hashtags',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }

    static associate() {
        Hashtag.belongsToMany(Post, { through: 'PostHashtag' });
        // PostHashtag 접근시 : db.sequelize.models.PostHashtag로 접근
    }
}

export default Hashtag;