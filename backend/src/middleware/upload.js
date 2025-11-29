import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const avatarsDir = path.resolve(__dirname, '../../uploads/avatars')

const ensureDirectory = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true })
    }
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        ensureDirectory(avatarsDir)
        cb(null, avatarsDir)
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname) || '.png'
        const safeId = req.user?.id || 'guest'
        const uniqueName = `${safeId}-${Date.now()}${ext}`
        cb(null, uniqueName)
    },
})

const fileFilter = (req, file, cb) => {
    if (!file.mimetype?.startsWith('image/')) {
        return cb(new Error('Only image files are allowed'))
    }
    cb(null, true)
}

export const avatarUpload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 3 * 1024 * 1024,
    },
})
