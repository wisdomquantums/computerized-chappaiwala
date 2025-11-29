import { createSlice } from "@reduxjs/toolkit";
import { logout } from "../auth/authSlice";

const CART_ITEMS_KEY = "ccw-cart-items";
const CART_DETAILS_KEY = "ccw-cart-customer";

const parseJSON = (value, fallback) => {
    try {
        return value ? JSON.parse(value) : fallback;
    } catch (error) {
        return fallback;
    }
};

const persistItems = (items) => {
    localStorage.setItem(CART_ITEMS_KEY, JSON.stringify(items));
};

const persistDetails = (details) => {
    if (!details) {
        localStorage.removeItem(CART_DETAILS_KEY);
        return;
    }
    localStorage.setItem(CART_DETAILS_KEY, JSON.stringify(details));
};

const initialState = {
    items: parseJSON(localStorage.getItem(CART_ITEMS_KEY), []),
    customerDetails: parseJSON(localStorage.getItem(CART_DETAILS_KEY), null),
};

const normalizeItem = (service) => {
    if (!service) return null;
    const unitPrice =
        Number(service.basePrice) ||
        Number(service.paperChargeValue) ||
        Number(service.price) ||
        0;
    const resolvedQuantity = Math.max(1, Number(service.quantity) || 1);

    return {
        id: service.id,
        title: service.title || service.name,
        description: service.description,
        image: service.image,
        unitLabel: service.unitLabel,
        quantity: resolvedQuantity,
        unitPrice,
        service,
    };
};

const resetCartState = (state) => {
    state.items = [];
    state.customerDetails = null;
    persistItems(state.items);
    persistDetails(null);
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addItem: (state, action) => {
            const incoming = normalizeItem(action.payload) || action.payload;
            if (!incoming?.id) return;
            const existing = state.items.find((item) => item.id === incoming.id);
            if (existing) {
                existing.quantity += incoming.quantity || 1;
            } else {
                state.items.push({ ...incoming, quantity: incoming.quantity || 1 });
            }
            persistItems(state.items);
        },
        removeItem: (state, action) => {
            state.items = state.items.filter((item) => item.id !== action.payload);
            persistItems(state.items);
        },
        updateQuantity: (state, action) => {
            const { id, quantity } = action.payload || {};
            const target = state.items.find((item) => item.id === id);
            if (!target) return;
            target.quantity = Math.max(1, Number(quantity) || 1);
            persistItems(state.items);
        },
        clearCart: (state) => {
            resetCartState(state);
        },
        setCustomerDetails: (state, action) => {
            state.customerDetails = action.payload;
            persistDetails(action.payload);
        },
    },
    extraReducers: (builder) => {
        builder.addCase(logout, (state) => {
            resetCartState(state);
        });
    },
});

export const {
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    setCustomerDetails,
} = cartSlice.actions;

export default cartSlice.reducer;
