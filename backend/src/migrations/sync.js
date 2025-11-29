import '../config/database.js'
import sequelize from '../config/database.js'
import '../models/index.js'

const sync = async () => {
    try {
        await sequelize.sync({ alter: true })
        console.log('Database synchronized')
        process.exit(0)
    } catch (error) {
        console.error('Failed to sync database', error)
        process.exit(1)
    }
}

sync()
