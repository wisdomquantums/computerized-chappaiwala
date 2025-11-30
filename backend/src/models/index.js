import sequelize from '../config/database.js'

import User from './User.js'
import Role from './Role.js'
import Permission from './Permission.js'
import RolePermission from './RolePermission.js'

import Order from './Order.js'     // <<< REQUIRED
import Service from './Service.js'
import ServicePageContent from './ServicePageContent.js'
import ServiceStat from './ServiceStat.js'

import PortfolioItem from './PortfolioItem.js'
import PortfolioPageContent from './PortfolioPageContent.js'
import PortfolioListItem from './PortfolioListItem.js'

import ContactCard from './ContactCard.js'
import ContactPageContent from './ContactPageContent.js'

import Inquiry from './Inquiry.js'
import HomeSectionItem from './HomeSectionItem.js'
import CustomerAddress from './CustomerAddress.js'
import Ticket from './Ticket.js'

/* ---------------------- ROLE → ROLE_PERMISSION ---------------------- */

Role.hasMany(RolePermission, {
    as: 'permissionLinks',
    foreignKey: 'roleName',
    sourceKey: 'name'
})

Permission.hasMany(RolePermission, {
    as: 'roleLinks',
    foreignKey: 'permissionKey',
    sourceKey: 'key'
})

RolePermission.belongsTo(Role, {
    foreignKey: 'roleName',
    targetKey: 'name'
})

RolePermission.belongsTo(Permission, {
    foreignKey: 'permissionKey',
    targetKey: 'key'
})

/* ------------------------- USER ↔ ROLE ------------------------- */

User.belongsTo(Role, {
    as: 'roleMeta',
    foreignKey: 'role',
    targetKey: 'name'
})

Role.hasMany(User, {
    as: 'members',
    foreignKey: 'role',
    sourceKey: 'name'
})

/* ---------------------- USER → ADDRESSES ---------------------- */

User.hasMany(CustomerAddress, {
    as: 'addresses',
    foreignKey: 'userId',
    onDelete: 'CASCADE'
})

CustomerAddress.belongsTo(User, {
    as: 'owner',
    foreignKey: 'userId'
})

/* ---------------------- ORDER RELATION ---------------------- */

Order.belongsTo(User, { foreignKey: 'userId' })
User.hasMany(Order, { foreignKey: 'userId' })

/* ---------------------- SERVICE CONTENT ---------------------- */

ServicePageContent.hasMany(ServiceStat, {
    as: 'stats',
    foreignKey: 'contentId',
    onDelete: 'CASCADE'
})

ServiceStat.belongsTo(ServicePageContent, {
    as: 'content',
    foreignKey: 'contentId'
})

export {
    sequelize,
    User,
    Role,
    Permission,
    RolePermission,
    Order,                 // <<< FIXED
    Service,
    ServicePageContent,
    ServiceStat,
    PortfolioItem,
    PortfolioPageContent,
    PortfolioListItem,
    ContactCard,
    ContactPageContent,
    Inquiry,
    HomeSectionItem,
    CustomerAddress,
    Ticket
}

export default {
    sequelize,
    User,
    Role,
    Permission,
    RolePermission,
    Order,                  // <<< FIXED
    Service,
    ServicePageContent,
    ServiceStat,
    PortfolioItem,
    PortfolioPageContent,
    PortfolioListItem,
    ContactCard,
    ContactPageContent,
    Inquiry,
    HomeSectionItem,
    CustomerAddress,
    Ticket
}
