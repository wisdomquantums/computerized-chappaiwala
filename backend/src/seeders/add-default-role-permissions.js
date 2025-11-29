import { bulkInsert, helperContext, safeLog } from './helpers.js'

const { queryInterface } = helperContext

const now = new Date()

const assignments = [
    { roleName: 'admin', permissionKey: 'manage_services', createdAt: now, updatedAt: now },
    { roleName: 'admin', permissionKey: 'manage_orders', createdAt: now, updatedAt: now },
    { roleName: 'admin', permissionKey: 'manage_users', createdAt: now, updatedAt: now },
    { roleName: 'admin', permissionKey: 'manage_roles', createdAt: now, updatedAt: now },
    { roleName: 'admin', permissionKey: 'manage_portfolio', createdAt: now, updatedAt: now },
    { roleName: 'admin', permissionKey: 'manage_tickets', createdAt: now, updatedAt: now },
    { roleName: 'owner', permissionKey: 'manage_services', createdAt: now, updatedAt: now },
    { roleName: 'owner', permissionKey: 'manage_orders', createdAt: now, updatedAt: now },
    { roleName: 'owner', permissionKey: 'manage_users', createdAt: now, updatedAt: now },
    { roleName: 'owner', permissionKey: 'manage_tickets', createdAt: now, updatedAt: now },
    { roleName: 'employee', permissionKey: 'manage_orders', createdAt: now, updatedAt: now },
    { roleName: 'employee', permissionKey: 'manage_services', createdAt: now, updatedAt: now },
    { roleName: 'employee', permissionKey: 'manage_tickets', createdAt: now, updatedAt: now },
]

const run = async () => {
    const targetRoles = [...new Set(assignments.map((entry) => entry.roleName))]
    try {
        await queryInterface.bulkDelete('role_permissions', { roleName: targetRoles })
        safeLog(`Cleared existing permissions for roles: ${targetRoles.join(', ')}`)
    } catch (error) {
        safeLog(`Unable to clear role_permissions: ${error.message}`)
    }

    const inserted = await bulkInsert('role_permissions', assignments)
    if (!inserted) {
        safeLog('Role-permission seed skipped (role_permissions table missing).')
    }
}

export default run
