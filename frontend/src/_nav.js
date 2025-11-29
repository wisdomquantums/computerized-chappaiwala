export const primaryNav = [
    { label: 'Home', to: '/' },
    { label: 'About', to: '/about' },
    { label: 'Services', to: '/services' },
    { label: 'Portfolio', to: '/portfolio' },
    { label: 'Contact', to: '/contact' },
]

export const authActions = [
    {
        label: 'Account Access',
        variant: 'menu',
        icon: 'user',
        items: [
            { label: 'Customer Login', to: '/login', description: 'Existing members sign in' },
            { label: 'Register Account', to: '/register', description: 'New partners join here' },
        ],
    },
    { label: 'Admin Portal', to: '/admin/login', variant: 'icon', ariaLabel: 'Admin login' },
]

const navConfig = {
    primary: primaryNav,
    actions: authActions,
}

export default navConfig
