import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/database.js'
import User from './User.js'
import Order from './Order.js'

export const TICKET_STATUS_OPTIONS = [
    'Open',
    'Acknowledged',
    'In progress',
    'Waiting on customer',
    'Resolved',
    'Closed',
]

export const TICKET_PRIORITY_OPTIONS = ['Low', 'Normal', 'High', 'Urgent']

export const TICKET_CATEGORY_OPTIONS = [
    'Order issue',
    'Delivery',
    'Billing',
    'Product quality',
    'Account',
    'Other',
]

class Ticket extends Model { }

Ticket.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: true,
        },
        orderId: {
            type: DataTypes.UUID,
            allowNull: true,
        },
        subject: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: TICKET_CATEGORY_OPTIONS[0],
        },
        priority: {
            type: DataTypes.ENUM(...TICKET_PRIORITY_OPTIONS),
            allowNull: false,
            defaultValue: TICKET_PRIORITY_OPTIONS[1],
        },
        status: {
            type: DataTypes.ENUM(...TICKET_STATUS_OPTIONS),
            allowNull: false,
            defaultValue: TICKET_STATUS_OPTIONS[0],
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        channel: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'portal',
        },
        contactName: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        contactEmail: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        contactPhone: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        resolutionNotes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        attachments: {
            type: DataTypes.JSON,
            allowNull: true,
            defaultValue: [],
        },
        metadata: {
            type: DataTypes.JSON,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'Ticket',
        tableName: 'tickets',
        timestamps: true,
        indexes: [
            { fields: ['status'] },
            { fields: ['priority'] },
            { fields: ['orderId'] },
        ],
    },
)

Ticket.belongsTo(User, { as: 'requester', foreignKey: 'userId' })
User.hasMany(Ticket, { as: 'tickets', foreignKey: 'userId' })

Ticket.belongsTo(Order, { as: 'order', foreignKey: 'orderId' })
Order.hasMany(Ticket, { as: 'tickets', foreignKey: 'orderId' })

export default Ticket
