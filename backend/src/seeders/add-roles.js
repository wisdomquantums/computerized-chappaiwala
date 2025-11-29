import { bulkInsert, safeLog } from './helpers.js'

const now = new Date()

const baseRoles = [
    {
        name: 'admin',
        label: 'Administrator',
        description: 'Full system access.',
        createdAt: now,
        updatedAt: now,
    },
    {
        name: 'owner',
        label: 'Owner',
        description: 'Business owners who supervise staff and customers.',
        createdAt: now,
        updatedAt: now,
    },
    {
        name: 'employee',
        label: 'Employee',
        description: 'Internal staff with limited admin access.',
        createdAt: now,
        updatedAt: now,
    },
    {
        name: 'customer',
        label: 'Customer',
        description: 'External users consuming services.',
        createdAt: now,
        updatedAt: now,
    },
]

const run = async () => {
    const inserted = await bulkInsert('roles', baseRoles)
    if (!inserted) {
        safeLog('Add Roles skipped (roles table missing).')
    }
}

export default run
