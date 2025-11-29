import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

const isMissingTableError = (error) => {
    if (!error) return false
    const code = error?.original?.code
    if (code === 'ER_NO_SUCH_TABLE') return true
    const message = error?.message?.toLowerCase() || ''
    return message.includes('does not exist') || message.includes("doesn't exist") || message.includes('no description found')
}

const ensureColumn = async (queryInterface, tableName, columnName, definition) => {
    let definitionMap
    try {
        definitionMap = await queryInterface.describeTable(tableName)
    } catch (error) {
        if (isMissingTableError(error)) {
            console.warn(`Table \`${tableName}\` is missing; skipping column \`${columnName}\`.`)
            return
        }
        throw error
    }
    if (definitionMap[columnName]) {
        console.info(`Column \`${columnName}\` already exists on \`${tableName}\`.`)
        return
    }
    console.info(`Adding column \`${columnName}\` to \`${tableName}\`...`)
    await queryInterface.addColumn(tableName, columnName, definition)
    console.info(`Column \`${columnName}\` added.`)
}

const ensureTable = async (queryInterface, tableName, attributes) => {
    try {
        await queryInterface.describeTable(tableName)
        console.info(`Table \`${tableName}\` already exists.`)
        return
    } catch (error) {
        if (!isMissingTableError(error)) {
            throw error
        }
    }

    console.info(`Creating table \`${tableName}\`...`)
    await queryInterface.createTable(tableName, attributes)
    console.info(`Table \`${tableName}\` created.`)
}

const run = async () => {
    const queryInterface = sequelize.getQueryInterface()

    try {
        await ensureColumn(queryInterface, 'portfolio_items', 'description', {
            type: DataTypes.TEXT,
            allowNull: true,
        })
        await ensureColumn(queryInterface, 'portfolio_items', 'gallery', {
            type: DataTypes.JSON,
            allowNull: true,
        })

        await ensureTable(queryInterface, 'portfolio_page_content', {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
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
        })

        await ensureTable(queryInterface, 'portfolio_list_items', {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
                primaryKey: true,
            },
            listType: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            title: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            description: {
                type: DataTypes.TEXT,
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
        })

        console.log('Portfolio page schema ensured.')
    } catch (error) {
        console.error('Failed to ensure portfolio schema', error)
        process.exitCode = 1
    } finally {
        await sequelize.close()
    }
}

run()
