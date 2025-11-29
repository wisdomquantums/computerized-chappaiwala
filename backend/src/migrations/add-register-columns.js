import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

const requiredColumns = {
    username: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
    },
    mobileNumber: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    emailVerifiedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}

const ensureColumn = async (queryInterface, tableDefinition, columnName, definition) => {
    if (tableDefinition[columnName]) {
        console.info(`Column \`${columnName}\` already exists on users table.`)
        return
    }

    console.info(`Adding missing column \`${columnName}\` to users table...`)
    await queryInterface.addColumn('users', columnName, definition)
    console.info(`Column \`${columnName}\` added.`)
}

const run = async () => {
    const queryInterface = sequelize.getQueryInterface()

    try {
        const tableDefinition = await queryInterface.describeTable('users')
        for (const [columnName, definition] of Object.entries(requiredColumns)) {
            await ensureColumn(queryInterface, tableDefinition, columnName, definition)
        }
        console.log('Register-related columns verified.')
    } catch (error) {
        console.error('Failed to ensure register columns exist', error)
        process.exitCode = 1
    } finally {
        await sequelize.close()
    }
}

run()
