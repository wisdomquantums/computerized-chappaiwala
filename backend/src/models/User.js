import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/database.js'

class User extends Model { }

User.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        mobileNumber: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        company: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        designation: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        gstNumber: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        addressLine1: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        addressLine2: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        city: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        state: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        pincode: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        preferences: {
            type: DataTypes.JSON,
            allowNull: true,
            defaultValue: {},
        },
        avatarUrl: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'customer',
            validate: {
                isIn: [['admin', 'owner', 'employee', 'customer']],
            },
        },
        status: {
            type: DataTypes.ENUM('active', 'inactive'),
            defaultValue: 'active',
        },
        emailVerifiedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        timestamps: true,
    },
)

export default User
