import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import routes from './routes/index.js'
import sequelize from './config/database.js'
import { errorHandler, notFound } from './middleware/errorHandler.js'
import {
    Permission,
    PortfolioItem,
    PortfolioListItem,
    PortfolioPageContent,
    Role,
    RolePermission,
    Service,
    ServicePageContent,
    ServiceStat,
    ContactCard,
    ContactPageContent,
    HomeSectionItem,
    Ticket,
} from './models/index.js'
import { runAllSeeders } from './seeders/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const app = express()
const port = process.env.PORT || 4000

app.use(cors({ origin: true, credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

const uploadsDir = path.resolve(__dirname, '../uploads')
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true })
}
app.use('/uploads', express.static(uploadsDir))

const frontendDistDir = path.resolve(__dirname, '../../frontend/dist')
const frontendIndexFile = path.join(frontendDistDir, 'index.html')
const serveFrontend = fs.existsSync(frontendDistDir)
if (serveFrontend) {
    app.use(express.static(frontendDistDir))
}

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use('/api', routes)

if (serveFrontend) {
    app.get('*', (req, res, next) => {
        if (req.originalUrl?.startsWith('/api') || req.originalUrl?.startsWith('/uploads')) {
            return next()
        }
        if (fs.existsSync(frontendIndexFile)) {
            return res.sendFile(frontendIndexFile)
        }
        return next()
    })
}

app.use(notFound)
app.use(errorHandler)

const start = async () => {
    try {
        await sequelize.authenticate()
        console.log('Database connected')

        await Role.sync()
        await Permission.sync()
        await RolePermission.sync()
        await Service.sync()
        await ServicePageContent.sync()
        await ServiceStat.sync()
        await PortfolioItem.sync()
        await PortfolioPageContent.sync()
        await PortfolioListItem.sync()
        await ContactPageContent.sync()
        await ContactCard.sync()
        await HomeSectionItem.sync()
        await Ticket.sync()
        console.log('Core tables ready')

        await runAllSeeders()
        app.listen(port, () => console.log(`API listening on port ${port}`))
    } catch (error) {
        console.error('Unable to connect to database', error)
        process.exit(1)
    }
}

start()
