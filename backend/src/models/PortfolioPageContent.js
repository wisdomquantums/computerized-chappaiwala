import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/database.js'

class PortfolioPageContent extends Model { }

PortfolioPageContent.init(
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
        trustTitle: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        trustDescription: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        ideasTitle: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        ideasDescription: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        ctaEyebrow: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        ctaTitle: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        ctaDescription: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        primaryCtaLabel: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        primaryCtaLink: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        secondaryCtaLabel: {
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
        modelName: 'PortfolioPageContent',
        tableName: 'portfolio_page_content',
        timestamps: true,
    },
)

export default PortfolioPageContent
