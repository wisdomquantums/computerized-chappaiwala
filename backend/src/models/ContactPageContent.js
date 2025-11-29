import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/database.js'

class ContactPageContent extends Model { }

ContactPageContent.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        heroEyebrow: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'Contact Us',
        },
        heroTitle: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'We’re here to help you with your printing needs',
        },
        heroDescription: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        messageTitle: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'Send us a message',
        },
        messageDescription: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        mapEmbedUrl: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        openingEyebrow: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        openingTitle: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        openingDescription: {
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
        formWhatsappLabel: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        formWhatsappLink: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'ContactPageContent',
        tableName: 'contact_page_contents',
        timestamps: true,
    },
)

export default ContactPageContent
