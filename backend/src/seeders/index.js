import sequelize from '../config/database.js'
import addRoles from './add-roles.js'
import addDefaultRoles from './add-default-roles.js'
import addDefaultPermissions from './add-default-permissions.js'
import addDefaultRolePermissions from './add-default-role-permissions.js'
import employeeSeed from './employee-seed.js'
import ownerSeed from './owner-seed.js'
import addDefaultUsers from './add-default-users.js'
import homeDemoSections from './home-demo-sections.js'
import { safeLog } from './helpers.js'

const seeders = [
    { label: 'Add Roles', run: addRoles },
    { label: 'Add Default Roles', run: addDefaultRoles },
    { label: 'Add Default Permissions', run: addDefaultPermissions },
    { label: 'Add Default Role Permissions', run: addDefaultRolePermissions },
    { label: 'Default Admin User', run: addDefaultUsers },
    { label: 'Employee Seed', run: employeeSeed },
    { label: 'Owner Seed', run: ownerSeed },
    { label: 'Home Demo Sections', run: homeDemoSections },
]

export const runAllSeeders = async () => {
    await sequelize.authenticate()
    for (const { label, run } of seeders) {
        try {
            await run()
            safeLog(`${label} completed.`)
        } catch (error) {
            console.error(`[seeders] ${label} failed`, error) // eslint-disable-line no-console
        }
    }
}

if (import.meta.url === `file://${process.argv[1]}`) {
    runAllSeeders()
        .then(() => {
            safeLog('All seeders executed.')
            process.exit(0)
        })
        .catch((error) => {
            console.error('[seeders] Seeding failed', error) // eslint-disable-line no-console
            process.exit(1)
        })
}
