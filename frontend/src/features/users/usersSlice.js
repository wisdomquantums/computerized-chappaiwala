import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../../configs/axios'

const initialState = {
    list: [],
    loading: false,
    updatingId: null,
    deletingId: null,
    creating: false,
    error: null,
    createError: null,
}

export const fetchUsers = createAsyncThunk('users/fetchUsers', async (options = {}, { rejectWithValue }) => {
    try {
        const { data } = await api.get('/auth/users')
        return data.users || []
    } catch (error) {
        return rejectWithValue(error.message)
    }
})

export const createUser = createAsyncThunk('users/createUser', async (payload, { rejectWithValue }) => {
    try {
        const { data } = await api.post('/auth/users', payload)
        return data.user
    } catch (error) {
        return rejectWithValue(error.message)
    }
})

export const updateUser = createAsyncThunk('users/updateUser', async ({ id, updates }, { rejectWithValue }) => {
    try {
        const { data } = await api.patch(`/auth/users/${id}`, updates)
        return data.user
    } catch (error) {
        return rejectWithValue(error.message)
    }
})

export const deleteUser = createAsyncThunk('users/deleteUser', async (id, { rejectWithValue }) => {
    try {
        await api.delete(`/auth/users/${id}`)
        return id
    } catch (error) {
        return rejectWithValue(error.message)
    }
})

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state, action) => {
                if (!action.meta?.arg?.silent) {
                    state.loading = true
                }
                state.error = null
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false
                state.list = action.payload
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(createUser.pending, (state) => {
                state.creating = true
                state.createError = null
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.creating = false
                state.list = [action.payload, ...state.list]
            })
            .addCase(createUser.rejected, (state, action) => {
                state.creating = false
                state.createError = action.payload
            })
            .addCase(updateUser.pending, (state, action) => {
                state.updatingId = action.meta.arg.id
                state.error = null
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.updatingId = null
                state.list = state.list.map((user) => (user.id === action.payload.id ? action.payload : user))
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.updatingId = null
                state.error = action.payload
            })
            .addCase(deleteUser.pending, (state, action) => {
                state.deletingId = action.meta.arg
                state.error = null
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.deletingId = null
                state.list = state.list.filter((user) => user.id !== action.payload)
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.deletingId = null
                state.error = action.payload
            })
    },
})

export default usersSlice.reducer
