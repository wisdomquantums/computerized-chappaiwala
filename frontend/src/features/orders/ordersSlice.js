import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../../configs/axios'
import { extractOrderError, normalizeOrder, normalizeOrderCollection } from './orderUtils'

const initialState = {
    list: [],
    loading: false,
    error: null,
}

export const fetchOrders = createAsyncThunk('orders/fetchOrders', async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.get('/orders')
        return data.orders || []
    } catch (error) {
        return rejectWithValue(extractOrderError(error))
    }
})

export const createOrder = createAsyncThunk('orders/createOrder', async (payload, { rejectWithValue }) => {
    try {
        const { data } = await api.post('/orders', payload)
        return data.order
    } catch (error) {
        return rejectWithValue(extractOrderError(error))
    }
})

export const updateOrder = createAsyncThunk('orders/updateOrder', async ({ id, ...payload }, { rejectWithValue }) => {
    try {
        const { data } = await api.put(`/orders/${id}`, payload)
        return data.order
    } catch (error) {
        return rejectWithValue(extractOrderError(error))
    }
})

export const deleteOrder = createAsyncThunk('orders/deleteOrder', async (id, { rejectWithValue }) => {
    try {
        await api.delete(`/orders/${id}`)
        return id
    } catch (error) {
        return rejectWithValue(extractOrderError(error))
    }
})

export const updateOrderStatus = createAsyncThunk('orders/updateOrderStatus', async ({ id, status }, { rejectWithValue }) => {
    try {
        const { data } = await api.patch(`/orders/${id}/status`, { status })
        return data.order
    } catch (error) {
        return rejectWithValue(extractOrderError(error))
    }
})

const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrders.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.loading = false
                state.list = normalizeOrderCollection(action.payload)
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(createOrder.pending, (state) => {
                state.error = null
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.list.unshift(normalizeOrder(action.payload))
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.error = action.payload
            })
            .addCase(updateOrder.fulfilled, (state, action) => {
                const updated = normalizeOrder(action.payload)
                state.list = state.list.map((order) => (order.id === updated.id ? updated : order))
            })
            .addCase(updateOrder.rejected, (state, action) => {
                state.error = action.payload
            })
            .addCase(deleteOrder.fulfilled, (state, action) => {
                state.list = state.list.filter((order) => order.id !== action.payload)
            })
            .addCase(deleteOrder.rejected, (state, action) => {
                state.error = action.payload
            })
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                const updated = normalizeOrder(action.payload)
                state.list = state.list.map((order) => (order.id === updated.id ? updated : order))
            })
            .addCase(updateOrderStatus.rejected, (state, action) => {
                state.error = action.payload
            })
    },
})

export default ordersSlice.reducer
