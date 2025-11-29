import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/database.js'

class RolePermission extends Model { }

RolePermission.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        roleName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        permissionKey: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'RolePermission',
        tableName: 'role_permissions',
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['roleName', 'permissionKey'],
            },
        ],
    },
)

export default RolePermission
