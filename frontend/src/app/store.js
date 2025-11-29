import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import servicesReducer from '../features/services/servicesSlice'
import servicePageReducer from '../features/servicePage/servicePageSlice'
import portfolioReducer from '../features/portfolio/portfolioSlice'
import contactReducer from '../features/contact/contactSlice'
import usersReducer from '../features/users/usersSlice'
import rolesReducer from '../features/roles/rolesSlice'
import cartReducer from '../features/cart/cartSlice'
import inquiriesReducer from '../features/inquiries/inquiriesSlice'
import homeReducer from '../features/home/homeSlice'
import ordersReducer from '../features/orders/ordersSlice'
import customerOrdersReducer from '../features/orders/customerOrdersSlice'
import addressesReducer from '../features/addresses/addressesSlice'
import customerTicketsReducer from '../features/tickets/customerTicketsSlice'
import adminTicketsReducer from '../features/tickets/adminTicketsSlice'

const store = configureStore({
    reducer: {
        auth: authReducer,
        services: servicesReducer,
        servicePage: servicePageReducer,
        portfolio: portfolioReducer,
        contact: contactReducer,
        users: usersReducer,
        roles: rolesReducer,
        orders: ordersReducer,
        customerOrders: customerOrdersReducer,
        cart: cartReducer,
        inquiries: inquiriesReducer,
        home: homeReducer,
        addresses: addressesReducer,
        customerTickets: customerTicketsReducer,
        adminTickets: adminTicketsReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})

export default store
