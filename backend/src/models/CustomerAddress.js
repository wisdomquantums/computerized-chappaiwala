import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/database.js'

const ADDRESS_TYPES = ['Home', 'Office', 'Other']

class CustomerAddress extends Model { }

CustomerAddress.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        label: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'Home',
        },
        recipientName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        line1: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        line2: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        state: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        pincode: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        landmark: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        type: {
            type: DataTypes.ENUM(...ADDRESS_TYPES),
            allowNull: false,
            defaultValue: 'Home',
        },
        instructions: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        isDefault: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    },
    {
        sequelize,
        modelName: 'CustomerAddress',
        tableName: 'customer_addresses',
        timestamps: true,
        indexes: [
            { fields: ['userId', 'isDefault'] },
            { fields: ['city'] },
            { fields: ['pincode'] },
        ],
    },
)

export { ADDRESS_TYPES }
export default CustomerAddress
