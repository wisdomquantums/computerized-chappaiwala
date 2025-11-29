import sequelize from '../config/database.js'
import User from './User.js'
import Service from './Service.js'
import ServicePageContent from './ServicePageContent.js'
import ServiceStat from './ServiceStat.js'
import AboutSection from './AboutSection.js'
import AboutSectionItem from './AboutSectionItem.js'
import Order from './Order.js'
import PortfolioItem from './PortfolioItem.js'
import PortfolioPageContent from './PortfolioPageContent.js'
import PortfolioListItem from './PortfolioListItem.js'
import ContactCard from './ContactCard.js'
import ContactPageContent from './ContactPageContent.js'
import Role from './Role.js'
import Permission from './Permission.js'
import RolePermission from './RolePermission.js'
import Inquiry from './Inquiry.js'
import HomeSectionItem from './HomeSectionItem.js'
import CustomerAddress from './CustomerAddress.js'
import Ticket from './Ticket.js'

Role.hasMany(RolePermission, {
    as: 'permissionLinks',
    foreignKey: 'roleName',
    sourceKey: 'name',
    onDelete: 'CASCADE',
    hooks: true,
})

Permission.hasMany(RolePermission, {
    as: 'roleLinks',
    foreignKey: 'permissionKey',
    sourceKey: 'key',
    onDelete: 'CASCADE',
    hooks: true,
})

RolePermission.belongsTo(Role, { foreignKey: 'roleName', targetKey: 'name' })
RolePermission.belongsTo(Permission, { foreignKey: 'permissionKey', targetKey: 'key' })

Role.hasMany(User, { as: 'members', foreignKey: 'role', sourceKey: 'name' })
User.belongsTo(Role, { as: 'roleMeta', foreignKey: 'role', targetKey: 'name' })

User.hasMany(CustomerAddress, {
    as: 'addresses',
    foreignKey: 'userId',
    onDelete: 'CASCADE',
})
CustomerAddress.belongsTo(User, { as: 'owner', foreignKey: 'userId' })

ServicePageContent.hasMany(ServiceStat, {
    as: 'stats',
    foreignKey: 'contentId',
    onDelete: 'CASCADE',
})
ServiceStat.belongsTo(ServicePageContent, { as: 'content', foreignKey: 'contentId' })

export {
    sequelize,
    User,
    Service,
    Order,
    PortfolioItem,
    Role,
    Permission,
    RolePermission,
    ServicePageContent,
    ServiceStat,
    PortfolioPageContent,
    PortfolioListItem,
    ContactCard,
    ContactPageContent,
    Inquiry,
    HomeSectionItem,
    CustomerAddress,
    Ticket,
}

export default {
    sequelize,
    User,
    Service,
    Order,
    PortfolioItem,
    PortfolioPageContent,
    PortfolioListItem,
    ContactCard,
    ContactPageContent,
    Role,
    Permission,
    RolePermission,
    ServicePageContent,
    ServiceStat,
    AboutSection,
    AboutSectionItem,
    Inquiry,
    HomeSectionItem,
    CustomerAddress,
    Ticket,
}
