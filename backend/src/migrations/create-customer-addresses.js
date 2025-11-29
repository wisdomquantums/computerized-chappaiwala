import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

const TABLE_NAME = 'customer_addresses'

const defineTable = async (queryInterface) => {
    const tableDefinition = {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
            onDelete: 'CASCADE',
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
            type: DataTypes.ENUM('Home', 'Office', 'Other'),
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
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    }

    await queryInterface.createTable(TABLE_NAME, tableDefinition)
    await queryInterface.addIndex(TABLE_NAME, ['userId', 'isDefault'])
    await queryInterface.addIndex(TABLE_NAME, ['city'])
    await queryInterface.addIndex(TABLE_NAME, ['pincode'])
}

const run = async () => {
    const queryInterface = sequelize.getQueryInterface()

    try {
        let exists = false
        try {
            await queryInterface.describeTable(TABLE_NAME)
            exists = true
        } catch (error) {
            exists = false
        }

        if (exists) {
            console.info(`Table \`${TABLE_NAME}\` already exists.`)
        } else {
            console.info(`Creating table \`${TABLE_NAME}\`...`)
            await defineTable(queryInterface)
            console.info('Customer addresses table created.')
        }
    } catch (error) {
        console.error('Failed to create customer addresses table', error)
        process.exitCode = 1
    } finally {
        await sequelize.close()
    }
}

run()
