import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/database.js'

class ServicePageContent extends Model { }

ServicePageContent.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        heroTagline: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        heroTitle: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        heroDescription: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        primaryCtaText: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        primaryCtaLink: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        secondaryCtaText: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        secondaryCtaLink: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'ServicePageContent',
        tableName: 'service_page_content',
        timestamps: true,
    },
)

export default ServicePageContent
