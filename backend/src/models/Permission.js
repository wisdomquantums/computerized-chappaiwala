import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/database.js'

class Permission extends Model { }

Permission.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        key: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        label: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
        },
    },
    {
        sequelize,
        modelName: 'Permission',
        tableName: 'permissions',
        timestamps: true,
    },
)

export default Permission
