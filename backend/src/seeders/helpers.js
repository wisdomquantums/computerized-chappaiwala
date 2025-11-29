import sequelize from '../config/database.js'

const queryInterface = sequelize.getQueryInterface()

const normalizeName = (entry) => {
    if (typeof entry === 'string') return entry.toLowerCase()
    return (entry?.tableName || entry?.TABLE_NAME || '').toLowerCase()
}

export const tableExists = async (tableName) => {
    const tables = await queryInterface.showAllTables()
    return tables.map(normalizeName).includes(tableName.toLowerCase())
}

export const bulkInsert = async (table, rows) => {
    if (!rows?.length) return false
    const exists = await tableExists(table)
    if (!exists) {
        console.warn(`[seeders] Skipping insert for "${table}" (table not found)`) // eslint-disable-line no-console
        return false
    }
    await queryInterface.bulkInsert(table, rows, { ignoreDuplicates: true })
    console.log(`[seeders] Inserted ${rows.length} rows into ${table}`) // eslint-disable-line no-console
    return true
}

export const safeLog = (message) => {
    console.log(`[seeders] ${message}`) // eslint-disable-line no-console
}

export const helperContext = { sequelize, queryInterface }
