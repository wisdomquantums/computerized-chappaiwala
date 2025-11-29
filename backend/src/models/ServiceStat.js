import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/database.js'

class ServiceStat extends Model { }

ServiceStat.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        label: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        value: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        detail: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        sortOrder: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        contentId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'service_page_content',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
    },
    {
        sequelize,
        modelName: 'ServiceStat',
        tableName: 'service_stats',
        timestamps: true,
    },
)

export default ServiceStat
