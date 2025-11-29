import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../../configs/axios'
import { logout } from '../auth/authSlice'

const initialState = {
    list: [],
    loading: false,
    error: null,
    initialized: false,
}

const extractErrorMessage = (error) => error?.response?.data?.message || error?.message || 'Something went wrong'

export const fetchAddresses = createAsyncThunk('addresses/fetch', async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.get('/addresses')
        return data.addresses || []
    } catch (error) {
        return rejectWithValue(extractErrorMessage(error))
    }
})

export const createAddress = createAsyncThunk('addresses/create', async (payload, { rejectWithValue }) => {
    try {
        const { data } = await api.post('/addresses', payload)
        return data.address
    } catch (error) {
        return rejectWithValue(extractErrorMessage(error))
    }
})

export const updateAddress = createAsyncThunk('addresses/update', async ({ id, ...payload }, { rejectWithValue }) => {
    try {
        const { data } = await api.put(`/addresses/${id}`, payload)
        return data.address
    } catch (error) {
        return rejectWithValue(extractErrorMessage(error))
    }
})

export const deleteAddress = createAsyncThunk('addresses/delete', async (id, { rejectWithValue }) => {
    try {
        await api.delete(`/addresses/${id}`)
        return id
    } catch (error) {
        return rejectWithValue(extractErrorMessage(error))
    }
})

export const markDefaultAddress = createAsyncThunk('addresses/markDefault', async (id, { rejectWithValue }) => {
    try {
        const { data } = await api.post(`/addresses/${id}/default`)
        return data.address
    } catch (error) {
        return rejectWithValue(extractErrorMessage(error))
    }
})

const normalizeAddress = (address) => ({
    ...address,
    isDefault: Boolean(address?.isDefault),
})

const addressesSlice = createSlice({
    name: 'addresses',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAddresses.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchAddresses.fulfilled, (state, action) => {
                state.loading = false
                state.initialized = true
                state.list = action.payload.map(normalizeAddress)
            })
            .addCase(fetchAddresses.rejected, (state, action) => {
                state.loading = false
                state.initialized = true
                state.error = action.payload
            })
            .addCase(createAddress.fulfilled, (state, action) => {
                state.list.unshift(normalizeAddress(action.payload))
            })
            .addCase(updateAddress.fulfilled, (state, action) => {
                const updated = normalizeAddress(action.payload)
                state.list = state.list.map((address) => (address.id === updated.id ? updated : address))
            })
            .addCase(deleteAddress.fulfilled, (state, action) => {
                state.list = state.list.filter((address) => address.id !== action.payload)
            })
            .addCase(markDefaultAddress.fulfilled, (state, action) => {
                const updated = normalizeAddress(action.payload)
                state.list = state.list.map((address) => ({
                    ...address,
                    isDefault: address.id === updated.id,
                }))
            })
            .addCase(createAddress.rejected, (state, action) => {
                state.error = action.payload
            })
            .addCase(updateAddress.rejected, (state, action) => {
                state.error = action.payload
            })
            .addCase(deleteAddress.rejected, (state, action) => {
                state.error = action.payload
            })
            .addCase(markDefaultAddress.rejected, (state, action) => {
                state.error = action.payload
            })
            .addCase(logout, () => initialState)
    },
})

export default addressesSlice.reducer
