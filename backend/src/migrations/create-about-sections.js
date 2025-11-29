import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

const isMissingTableError = (error) => {
    if (!error) return false
    if (error?.original?.code === 'ER_NO_SUCH_TABLE') return true
    const message = error?.message?.toLowerCase() || ''
    return (
        message.includes("doesn't exist") ||
        message.includes('does not exist') ||
        message.includes('no description found')
    )
}

const ensureTableExists = async (queryInterface, tableName, definition, { indexes = [] } = {}) => {
    try {
        await queryInterface.describeTable(tableName)
        console.info(`Table \`${tableName}\` already exists.`)
        return false
    } catch (error) {
        if (!isMissingTableError(error)) {
            throw error
        }
    }

    console.info(`Creating table \`${tableName}\`...`)
    await queryInterface.createTable(tableName, definition)
    console.info(`Table \`${tableName}\` created.`)

    if (indexes.length) {
        for (const index of indexes) {
            await queryInterface.addIndex(tableName, index)
        }
    }

    return true
}

const sectionDefinition = {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
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
    createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}

const sectionItemDefinition = {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    sectionKey: {
        type: DataTypes.STRING,
        allowNull: false,
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
    value: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    detail: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    mediaUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    meta: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    sortOrder: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}

const run = async () => {
    const queryInterface = sequelize.getQueryInterface()

    try {
        await ensureTableExists(queryInterface, 'about_sections', sectionDefinition)

        await ensureTableExists(queryInterface, 'about_section_items', sectionItemDefinition, {
            indexes: [
                { fields: ['sectionKey'], name: 'about_section_items_section_key_idx' },
                { fields: ['sectionKey', 'sortOrder'], name: 'about_section_items_section_key_sort_idx' },
            ],
        })

        console.log('About tables ensured.')
    } catch (error) {
        console.error('Failed to ensure about tables exist', error)
        process.exitCode = 1
    } finally {
        await sequelize.close()
    }
}

run()
