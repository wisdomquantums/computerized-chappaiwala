import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/database.js'

class AboutSectionItem extends Model { }

AboutSectionItem.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        sectionKey: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        subtitle: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        value: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        detail: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        mediaUrl: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        meta: {
            type: DataTypes.JSON,
            allowNull: true,
        },
        sortOrder: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
    },
    {
        sequelize,
        modelName: 'AboutSectionItem',
        tableName: 'about_section_items',
        timestamps: true,
    },
)

export default AboutSectionItem
