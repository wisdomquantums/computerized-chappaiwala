const ROLE_HIERARCHY = {
    customer: 0,
    employee: 1,
    owner: 2,
    admin: 3,
}

const rank = (role) => ROLE_HIERARCHY[role] ?? -1

export const isRoleOrHigher = (role, minimumRole) => {
    if (!role || !minimumRole) {
        return false
    }
    return rank(role) >= rank(minimumRole)
}

export const canManageRole = (managerRole, targetRole) => {
    if (!managerRole || !targetRole) {
        return false
    }

    if (managerRole === 'admin') {
        return true
    }

    return rank(managerRole) > rank(targetRole)
}

export default ROLE_HIERARCHY
