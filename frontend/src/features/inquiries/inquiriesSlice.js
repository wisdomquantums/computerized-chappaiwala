import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../../configs/axios'

const parseError = (error) => error?.message || 'Unable to load inquiries.'

export const fetchInquiries = createAsyncThunk('inquiries/fetchAll', async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.get('/inquiries')
        return data
    } catch (error) {
        return rejectWithValue(parseError(error))
    }
})

const inquiriesSlice = createSlice({
    name: 'inquiries',
    initialState: {
        list: [],
        pagination: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchInquiries.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchInquiries.fulfilled, (state, action) => {
                state.loading = false
                state.list = action.payload?.data || []
                state.pagination = action.payload?.pagination || null
            })
            .addCase(fetchInquiries.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload || 'Unable to load inquiries.'
            })
    },
})

export default inquiriesSlice.reducer
