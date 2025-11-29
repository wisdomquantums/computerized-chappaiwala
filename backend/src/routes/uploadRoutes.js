import express from 'express'
import { avatarUpload } from '../middleware/upload.js'

const router = express.Router()

// Generic image upload for services and other features
router.post('/image', avatarUpload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' })
    }
    const publicPath = `/uploads/avatars/${req.file.filename}`
    const absoluteUrl = `${req.protocol}://${req.get('host')}${publicPath}`
    return res.status(201).json({ url: absoluteUrl, path: publicPath })
})

export default router
