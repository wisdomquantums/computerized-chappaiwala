import { sequelize } from './src/models/index.js'

const run = async () => {
    try {
        await sequelize.query("ALTER TABLE `users` MODIFY `role` VARCHAR(255) NOT NULL DEFAULT 'customer'")
        console.log('users.role column updated to VARCHAR(255)')
    } catch (error) {
        console.error('Failed to alter column', error)
    } finally {
        await sequelize.close()
    }
}

run()
