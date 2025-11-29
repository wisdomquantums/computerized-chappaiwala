import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/database.js'
import User from './User.js'

export const ORDER_STATUS_OPTIONS = ['Pending', 'In progress', 'Waiting on client', 'QA', 'Completed', 'Archived']
export const ORDER_PRIORITY_OPTIONS = ['Low', 'Medium', 'High', 'Critical']
export const ORDER_CHANNEL_OPTIONS = ['Website', 'WhatsApp', 'Email', 'Phone', 'Referral', 'Store', 'Backoffice', 'Other']

class Order extends Model { }

Order.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        projectName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        clientName: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        clientEmail: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isEmail: true,
            },
        },
        clientPhone: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        company: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        serviceLine: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        channel: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: ORDER_CHANNEL_OPTIONS[0],
        },
        assignedTo: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM(...ORDER_STATUS_OPTIONS),
            defaultValue: ORDER_STATUS_OPTIONS[0],
        },
        priority: {
            type: DataTypes.ENUM(...ORDER_PRIORITY_OPTIONS),
            defaultValue: ORDER_PRIORITY_OPTIONS[1],
        },
        dueDate: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        budget: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        internalNotes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        tags: {
            type: DataTypes.JSON,
            allowNull: true,
            defaultValue: [],
        },
    },
    {
        sequelize,
        modelName: 'Order',
        tableName: 'orders',
        timestamps: true,
        indexes: [
            { fields: ['status', 'priority'] },
            { fields: ['dueDate'] },
        ],
    },
)

Order.belongsTo(User, { foreignKey: 'userId' })
User.hasMany(Order, { foreignKey: 'userId' })

export default Order
