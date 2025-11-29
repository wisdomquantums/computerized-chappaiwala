import bcrypt from 'bcryptjs'
import { User } from '../models/index.js'
import { safeLog } from './helpers.js'

const run = async () => {
    const email = process.env.SEED_EMPLOYEE_EMAIL || 'ops@computerizedchhappaiwala.com'
    const password = process.env.SEED_EMPLOYEE_PASSWORD || 'Employee@123'
    const hashed = await bcrypt.hash(password, 10)

    const [user, created] = await User.findOrCreate({
        where: { email },
        defaults: {
            name: 'Operations Lead',
            password: hashed,
            role: 'employee',
            status: 'active',
        },
    })

    if (!created) {
        user.role = 'employee'
        user.status = 'active'
        await user.save()
    }

    safeLog(`Employee seed ready (${email}). Password set via SEED_EMPLOYEE_PASSWORD env.`)
}

export default run
