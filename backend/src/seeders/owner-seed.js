import bcrypt from 'bcryptjs'
import { Role, User } from '../models/index.js'
import { safeLog } from './helpers.js'

const run = async () => {
    await Role.findOrCreate({
        where: { name: 'owner' },
        defaults: {
            label: 'Owner',
            description: 'Business owners who supervise staff and customers.',
            status: 'active',
        },
    })

    const email = process.env.SEED_OWNER_EMAIL || 'owner@computerizedchhappaiwala.com'
    const password = process.env.SEED_OWNER_PASSWORD || 'Owner@123'
    const hashed = await bcrypt.hash(password, 10)

    const [user, created] = await User.findOrCreate({
        where: { email },
        defaults: {
            name: 'Business Owner',
            password: hashed,
            role: 'owner',
            status: 'active',
        },
    })

    if (!created) {
        if (!user.name || !user.name.trim()) {
            user.name = 'Business Owner'
        }
        user.role = 'owner'
        user.status = 'active'
        if (process.env.SEED_OWNER_PASSWORD) {
            user.password = hashed
        }
        await user.save()
    }

    safeLog(`Owner seed ready (${email}). Password set via SEED_OWNER_PASSWORD env.`)
}

export default run
