import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/database.js'

class HomeSectionItem extends Model { }

HomeSectionItem.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        section: {
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
        badge: {
            type: DataTypes.STRING,
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
        price: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        linkLabel: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        linkUrl: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        secondaryLabel: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        secondaryUrl: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        sortOrder: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: 'active',
        },
        metadata: {
            type: DataTypes.JSON,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'HomeSectionItem',
        tableName: 'home_section_items',
        indexes: [{ fields: ['section', 'sortOrder'] }],
    },
)

export default HomeSectionItem
