import { bulkInsert, safeLog } from './helpers.js'

const now = new Date()

const permissions = [
    {
        key: 'manage_services',
        label: 'Manage Services',
        description: 'Create, update, and delete services.',
        createdAt: now,
        updatedAt: now,
    },
    {
        key: 'manage_orders',
        label: 'Manage Orders',
        description: 'View and update customer orders.',
        createdAt: now,
        updatedAt: now,
    },
    {
        key: 'manage_users',
        label: 'Manage Users',
        description: 'Invite employees and set roles.',
        createdAt: now,
        updatedAt: now,
    },
    {
        key: 'manage_roles',
        label: 'Manage Roles',
        description: 'Create roles and assign permissions.',
        createdAt: now,
        updatedAt: now,
    },
    {
        key: 'manage_portfolio',
        label: 'Manage Portfolio',
        description: 'Publish new case studies or work samples.',
        createdAt: now,
        updatedAt: now,
    },
    {
        key: 'manage_tickets',
        label: 'Manage Support Tickets',
        description: 'View and respond to customer support tickets.',
        createdAt: now,
        updatedAt: now,
    },
]

const run = async () => {
    const inserted = await bulkInsert('permissions', permissions)
    if (!inserted) {
        safeLog('Default permission seed skipped (permissions table missing).')
    }
}

export default run
