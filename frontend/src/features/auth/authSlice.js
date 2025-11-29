import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../../configs/axios'

const persistedUser = localStorage.getItem('user')
const persistedToken = localStorage.getItem('token')

const initialState = {
    user: persistedUser ? JSON.parse(persistedUser) : null,
    token: persistedToken || null,
    loading: false,
    error: null,
}

const extractErrorMessage = (error) => error?.response?.data?.message || error.message || 'Something went wrong'

export const loginUser = createAsyncThunk('auth/loginUser', async (credentials, { rejectWithValue }) => {
    try {
        const { data } = await api.post('/auth/login', credentials)
        return data
    } catch (error) {
        return rejectWithValue(extractErrorMessage(error))
    }
})

export const loginAdmin = createAsyncThunk('auth/loginAdmin', async (credentials, { rejectWithValue }) => {
    try {
        const { data } = await api.post('/auth/admin-login', credentials)
        return data
    } catch (error) {
        return rejectWithValue(extractErrorMessage(error))
    }
})

export const registerUser = createAsyncThunk('auth/registerUser', async (payload, { rejectWithValue }) => {
    try {
        const { data } = await api.post('/auth/register', payload)
        return data
    } catch (error) {
        return rejectWithValue(extractErrorMessage(error))
    }
})

export const fetchProfile = createAsyncThunk('auth/fetchProfile', async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.get('/auth/profile')
        return data
    } catch (error) {
        return rejectWithValue(extractErrorMessage(error))
    }
})

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null
            state.token = null
            localStorage.removeItem('user')
            localStorage.removeItem('token')
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false
                state.user = action.payload.user
                state.token = action.payload.token
                localStorage.setItem('user', JSON.stringify(action.payload.user))
                localStorage.setItem('token', action.payload.token)
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(loginAdmin.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(loginAdmin.fulfilled, (state, action) => {
                state.loading = false
                state.user = action.payload.user
                state.token = action.payload.token
                localStorage.setItem('user', JSON.stringify(action.payload.user))
                localStorage.setItem('token', action.payload.token)
            })
            .addCase(loginAdmin.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(registerUser.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false
                state.user = action.payload.user
                state.token = action.payload.token
                localStorage.setItem('user', JSON.stringify(action.payload.user))
                localStorage.setItem('token', action.payload.token)
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(fetchProfile.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.loading = false
                state.user = action.payload.user
                if (action.payload?.user) {
                    localStorage.setItem('user', JSON.stringify(action.payload.user))
                }
            })
            .addCase(fetchProfile.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    },
})

export const { logout } = authSlice.actions
export default authSlice.reducer
