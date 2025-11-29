import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../../configs/axios'

const parseError = (error) => error?.response?.data?.message || error?.message || 'Request failed'

const sortRecords = (records = []) =>
    [...records].sort((a, b) => {
        if (a.section === b.section) {
            return (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
        }
        return (a.section || '').localeCompare(b.section || '')
    })

const initialState = {
    records: [],
    loading: false,
    error: null,
    saving: false,
    deletingId: null,
}

export const fetchHomeSections = createAsyncThunk('home/fetchHomeSections', async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.get('/home/sections')
        return data.items || []
    } catch (error) {
        return rejectWithValue(parseError(error))
    }
})

export const createHomeSectionItem = createAsyncThunk('home/createHomeSectionItem', async (payload, { rejectWithValue }) => {
    try {
        const { data } = await api.post('/home/sections', payload)
        return data.item
    } catch (error) {
        return rejectWithValue(parseError(error))
    }
})

export const updateHomeSectionItem = createAsyncThunk('home/updateHomeSectionItem', async ({ id, ...payload }, { rejectWithValue }) => {
    try {
        const { data } = await api.put(`/home/sections/${id}`, payload)
        return data.item
    } catch (error) {
        return rejectWithValue(parseError(error))
    }
})

export const deleteHomeSectionItem = createAsyncThunk('home/deleteHomeSectionItem', async (id, { rejectWithValue }) => {
    try {
        await api.delete(`/home/sections/${id}`)
        return id
    } catch (error) {
        return rejectWithValue(parseError(error))
    }
})

const homeSlice = createSlice({
    name: 'home',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchHomeSections.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchHomeSections.fulfilled, (state, action) => {
                state.loading = false
                state.records = sortRecords(action.payload)
            })
            .addCase(fetchHomeSections.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(createHomeSectionItem.pending, (state) => {
                state.saving = true
            })
            .addCase(createHomeSectionItem.fulfilled, (state, action) => {
                state.saving = false
                state.records = sortRecords([...state.records, action.payload])
            })
            .addCase(createHomeSectionItem.rejected, (state, action) => {
                state.saving = false
                state.error = action.payload
            })
            .addCase(updateHomeSectionItem.pending, (state) => {
                state.saving = true
            })
            .addCase(updateHomeSectionItem.fulfilled, (state, action) => {
                state.saving = false
                state.records = sortRecords(
                    state.records.map((record) => (record.id === action.payload.id ? action.payload : record)),
                )
            })
            .addCase(updateHomeSectionItem.rejected, (state, action) => {
                state.saving = false
                state.error = action.payload
            })
            .addCase(deleteHomeSectionItem.pending, (state, action) => {
                state.deletingId = action.meta.arg
            })
            .addCase(deleteHomeSectionItem.fulfilled, (state, action) => {
                state.deletingId = null
                state.records = state.records.filter((record) => record.id !== action.payload)
            })
            .addCase(deleteHomeSectionItem.rejected, (state, action) => {
                state.deletingId = null
                state.error = action.payload
            })
    },
})

export default homeSlice.reducer
