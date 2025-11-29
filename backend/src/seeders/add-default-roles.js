import { User } from '../models/index.js'
import { safeLog } from './helpers.js'

const run = async () => {
    const [count] = await User.update({ role: 'customer' }, { where: { role: null } })
    safeLog(`Default roles applied to ${count} users lacking role assignment.`)
}

export default run
