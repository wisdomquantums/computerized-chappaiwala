import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/database.js'

class Service extends Model { }

Service.init(
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
            defaultValue: 'General',
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        iconKey: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'default',
        },
        image: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        gallery: {
            type: DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
        },
        paperCharge: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        printCharge: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        paperChargeValue: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        printChargeValue: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        unitLabel: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        supportWindow: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: '24-72 hrs',
        },
        priceLabel: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        rating: {
            type: DataTypes.FLOAT,
            allowNull: true,
            defaultValue: 4.8,
        },
        reviewCount: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0,
        },
        basePrice: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'Service',
        tableName: 'services',
        timestamps: true,
    },
)

export default Service
