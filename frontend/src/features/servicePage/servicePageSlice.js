import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../../configs/axios'

export const servicePageDefaultContent = {
    heroTagline: 'Premium print studio',
    heroTitle: "Sitamarhi's modern printing desk",
    heroDescription:
        'Tailor-made wedding cards, invoices, calendars, hand bills, and custom collateral – now wrapped in a cohesive story.',
    primaryCtaText: 'Explore catalog',
    primaryCtaLink: '/services',
    secondaryCtaText: 'Download rate card',
    secondaryCtaLink: '#services-grid',
}

const initialState = {
    content: servicePageDefaultContent,
    stats: [],
    loading: false,
    saving: false,
    error: null,
}

export const fetchServicePage = createAsyncThunk('servicePage/fetch', async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.get('/services/page/content')
        return data
    } catch (error) {
        return rejectWithValue(error.message)
    }
})

export const updateServicePageContent = createAsyncThunk('servicePage/updateContent', async (payload, { rejectWithValue }) => {
    try {
        const { data } = await api.put('/services/page/content', payload)
        return data.content
    } catch (error) {
        return rejectWithValue(error.message)
    }
})

export const deleteServicePageContent = createAsyncThunk('servicePage/deleteContent', async (_, { rejectWithValue }) => {
    try {
        await api.delete('/services/page/content')
        return true
    } catch (error) {
        return rejectWithValue(error.message)
    }
})

export const createServiceStat = createAsyncThunk('servicePage/createStat', async (payload, { rejectWithValue }) => {
    try {
        const { data } = await api.post('/services/page/stats', payload)
        return data.stat
    } catch (error) {
        return rejectWithValue(error.message)
    }
})

export const updateServiceStat = createAsyncThunk('servicePage/updateStat', async ({ id, ...payload }, { rejectWithValue }) => {
    try {
        const { data } = await api.put(`/services/page/stats/${id}`, payload)
        return data.stat
    } catch (error) {
        return rejectWithValue(error.message)
    }
})

export const deleteServiceStat = createAsyncThunk('servicePage/deleteStat', async (id, { rejectWithValue }) => {
    try {
        await api.delete(`/services/page/stats/${id}`)
        return id
    } catch (error) {
        return rejectWithValue(error.message)
    }
})

const servicePageSlice = createSlice({
    name: 'servicePage',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchServicePage.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchServicePage.fulfilled, (state, action) => {
                state.loading = false
                state.content = action.payload.content || servicePageDefaultContent
                state.stats = action.payload.stats || []
            })
            .addCase(fetchServicePage.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(updateServicePageContent.pending, (state) => {
                state.saving = true
                state.error = null
            })
            .addCase(updateServicePageContent.fulfilled, (state, action) => {
                state.saving = false
                state.content = action.payload || state.content
            })
            .addCase(updateServicePageContent.rejected, (state, action) => {
                state.saving = false
                state.error = action.payload
            })
            .addCase(deleteServicePageContent.pending, (state) => {
                state.saving = true
                state.error = null
            })
            .addCase(deleteServicePageContent.fulfilled, (state) => {
                state.saving = false
                state.content = servicePageDefaultContent
                state.stats = []
            })
            .addCase(deleteServicePageContent.rejected, (state, action) => {
                state.saving = false
                state.error = action.payload
            })
            .addCase(createServiceStat.fulfilled, (state, action) => {
                state.stats.push(action.payload)
            })
            .addCase(updateServiceStat.fulfilled, (state, action) => {
                state.stats = state.stats.map((stat) => (stat.id === action.payload.id ? action.payload : stat))
            })
            .addCase(deleteServiceStat.fulfilled, (state, action) => {
                state.stats = state.stats.filter((stat) => stat.id !== action.payload)
            })
    },
})

export default servicePageSlice.reducer
