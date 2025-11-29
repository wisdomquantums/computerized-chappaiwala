import bcrypt from 'bcryptjs'
import { helperContext, safeLog, tableExists } from './helpers.js'

const USERS_TABLE = 'users'
const DEFAULT_EMAIL = 'admin@gmail.com'
const DEFAULT_PASSWORD = 'admin@123'
const { queryInterface } = helperContext

const filterColumns = (columns, row) => {
    const allowed = new Set(Object.keys(columns || {}))
    return Object.fromEntries(Object.entries(row).filter(([key]) => allowed.has(key)))
}

const run = async () => {
    const hasTable = await tableExists(USERS_TABLE)
    if (!hasTable) {
        safeLog('Users table missing; default admin seed skipped.')
        return
    }

    const now = new Date()
    const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10)
    const desiredAdminRow = {
        id: 1,
        name: 'Admin',
        email: 'admin@gmail.com',
        password: hashedPassword,
        show_password: 'admin@123',
        status: true,
        role_id: 1,
        role: 'admin',
        createdAt: now,
        updatedAt: now,
    }

    let columns
    try {
        columns = await queryInterface.describeTable(USERS_TABLE)
    } catch (error) {
        safeLog(`Unable to inspect ${USERS_TABLE} table: ${error.message}`)
        return
    }

    const adminRow = filterColumns(columns, desiredAdminRow)

    if (columns.status && /enum/i.test(columns.status.type)) {
        adminRow.status = 'active'
    }

    if (!adminRow.role && columns.role) {
        adminRow.role = 'admin'
    }

    try {
        await queryInterface.bulkDelete(USERS_TABLE, { email: DEFAULT_EMAIL })
        await queryInterface.bulkInsert(USERS_TABLE, [adminRow], { ignoreDuplicates: true })
        safeLog(`Default admin user reset for ${DEFAULT_EMAIL}.`)
    } catch (error) {
        safeLog(`Failed to seed default admin user: ${error.message}`)
    }
}

export default run
