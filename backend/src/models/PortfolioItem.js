import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/database.js'

class PortfolioItem extends Model { }

PortfolioItem.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        image: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        gallery: {
            type: DataTypes.JSON,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'PortfolioItem',
        tableName: 'portfolio_items',
        timestamps: true,
    },
)

export default PortfolioItem
