import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/database.js'

class AboutSection extends Model { }

AboutSection.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        sectionKey: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        tagline: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        subtitle: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        primaryImage: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        secondaryImage: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        meta: {
            type: DataTypes.JSON,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'AboutSection',
        tableName: 'about_sections',
        timestamps: true,
    },
)

export default AboutSection
