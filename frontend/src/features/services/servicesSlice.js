import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../../configs/axios'
import resolveAssetUrl from '../../utils/assetUrl'

const coerceGalleryArray = (value) => {
    if (Array.isArray(value)) {
        return value
    }
    if (typeof value === 'string' && value.trim()) {
        try {
            const parsed = JSON.parse(value)
            return Array.isArray(parsed) ? parsed : []
        } catch (error) {
            return []
        }
    }
    return []
}

const normalizeServiceMedia = (service = {}) => {
    const normalized = { ...service }
    const gallery = coerceGalleryArray(service.gallery)
    normalized.image = resolveAssetUrl(service.image)
    normalized.gallery = gallery
        .map((item) => resolveAssetUrl(item))
        .filter(Boolean)
    if (!normalized.gallery.length && normalized.image) {
        normalized.gallery = [normalized.image]
    }
    return normalized
}

const normalizeServiceList = (collection = []) => collection.map((item) => normalizeServiceMedia(item))

const initialState = {
    list: [],
    loading: false,
    error: null,
}

export const fetchServices = createAsyncThunk('services/fetchServices', async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.get('/services')
        return data.services || []
    } catch (error) {
        return rejectWithValue(error.message)
    }
})

export const createService = createAsyncThunk('services/createService', async (payload, { rejectWithValue }) => {
    try {
        const { data } = await api.post('/services', payload)
        return data.service
    } catch (error) {
        return rejectWithValue(error.message)
    }
})

export const updateService = createAsyncThunk('services/updateService', async ({ id, ...payload }, { rejectWithValue }) => {
    try {
        const { data } = await api.put(`/services/${id}`, payload)
        return data.service
    } catch (error) {
        return rejectWithValue(error.message)
    }
})

export const deleteService = createAsyncThunk('services/deleteService', async (id, { rejectWithValue }) => {
    try {
        await api.delete(`/services/${id}`)
        return id
    } catch (error) {
        return rejectWithValue(error.message)
    }
})

const servicesSlice = createSlice({
    name: 'services',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchServices.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchServices.fulfilled, (state, action) => {
                state.loading = false
                state.list = normalizeServiceList(action.payload)
            })
            .addCase(fetchServices.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(createService.fulfilled, (state, action) => {
                state.list.push(normalizeServiceMedia(action.payload))
            })
            .addCase(updateService.fulfilled, (state, action) => {
                const updated = normalizeServiceMedia(action.payload)
                state.list = state.list.map((service) => (service.id === updated.id ? updated : service))
            })
            .addCase(deleteService.fulfilled, (state, action) => {
                state.list = state.list.filter((service) => service.id !== action.payload)
            })
    },
})

export default servicesSlice.reducer
