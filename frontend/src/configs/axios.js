import axios from 'axios'

const DEFAULT_DEV_API = import.meta.env.VITE_DEV_API_URL?.trim() || 'http://localhost:4000/api'
const DEV_PORTS = new Set(['5173', '4173', '5174'])

const resolveBaseUrl = () => {
    const configured = import.meta.env.VITE_API_URL?.trim()
    if (configured) return configured

    if (typeof window !== 'undefined') {
        const { origin, port } = window.location || {}

        if (DEV_PORTS.has(port)) {
            return DEFAULT_DEV_API
        }

        if (origin) {
            return `${origin}/api`
        }
    }

    return DEFAULT_DEV_API
}

const api = axios.create({
    baseURL: resolveBaseUrl(),
    withCredentials: true,
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error),
)

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status
        if (status === 401) {
            localStorage.removeItem('user')
            localStorage.removeItem('token')
        }
        const message = error.response?.data?.message || error.message || 'Something went wrong'
        return Promise.reject(new Error(message))
    },
)

export default api
