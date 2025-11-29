import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/database.js'

class PortfolioListItem extends Model { }

PortfolioListItem.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        listType: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        description: {
            type: DataTypes.TEXT,
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
        modelName: 'PortfolioListItem',
        tableName: 'portfolio_list_items',
        timestamps: true,
    },
)

export default PortfolioListItem
