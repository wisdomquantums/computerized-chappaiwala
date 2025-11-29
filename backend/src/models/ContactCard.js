import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/database.js'

class ContactCard extends Model { }

ContactCard.init(
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
        iconKey: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'location',
        },
        eyebrow: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: 'Contact',
        },
        lines: {
            type: DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
        },
        actionType: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        actionLabel: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        actionHref: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        sortOrder: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        isFeatured: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    },
    {
        sequelize,
        modelName: 'ContactCard',
        tableName: 'contact_cards',
        timestamps: true,
    },
)

export default ContactCard
