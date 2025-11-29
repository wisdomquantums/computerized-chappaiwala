import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../../configs/axios'

const initialState = {
    list: [],
    permissions: [],
    loading: false,
    permissionsLoading: false,
    savingRole: null,
    deletingRole: null,
    error: null,
    permissionError: null,
}

export const fetchRoles = createAsyncThunk('roles/fetchRoles', async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.get('/roles')
        return data.roles || []
    } catch (error) {
        return rejectWithValue(error.message)
    }
})

export const fetchPermissions = createAsyncThunk('roles/fetchPermissions', async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.get('/permissions')
        return data.permissions || []
    } catch (error) {
        return rejectWithValue(error.message)
    }
})

export const createRole = createAsyncThunk('roles/createRole', async (payload, { rejectWithValue }) => {
    try {
        const { data } = await api.post('/roles', payload)
        return data.role
    } catch (error) {
        return rejectWithValue(error.message)
    }
})

export const updateRole = createAsyncThunk('roles/updateRole', async ({ roleName, updates }, { rejectWithValue }) => {
    try {
        const { data } = await api.patch(`/roles/${roleName}`, updates)
        return data.role
    } catch (error) {
        return rejectWithValue(error.message)
    }
})

export const updateRolePermissions = createAsyncThunk('roles/updateRolePermissions', async ({ roleName, permissions }, { rejectWithValue }) => {
    try {
        const { data } = await api.put(`/roles/${roleName}/permissions`, { permissions })
        return data.role
    } catch (error) {
        return rejectWithValue(error.message)
    }
})

export const deleteRole = createAsyncThunk('roles/deleteRole', async (roleName, { rejectWithValue }) => {
    try {
        await api.delete(`/roles/${roleName}`)
        return roleName
    } catch (error) {
        return rejectWithValue(error.message)
    }
})

const rolesSlice = createSlice({
    name: 'roles',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchRoles.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchRoles.fulfilled, (state, action) => {
                state.loading = false
                state.list = action.payload
            })
            .addCase(fetchRoles.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(fetchPermissions.pending, (state) => {
                state.permissionsLoading = true
                state.permissionError = null
            })
            .addCase(fetchPermissions.fulfilled, (state, action) => {
                state.permissionsLoading = false
                state.permissions = action.payload
            })
            .addCase(fetchPermissions.rejected, (state, action) => {
                state.permissionsLoading = false
                state.permissionError = action.payload
            })
            .addCase(createRole.pending, (state) => {
                state.savingRole = 'create'
                state.error = null
            })
            .addCase(createRole.fulfilled, (state, action) => {
                state.savingRole = null
                state.list = [action.payload, ...state.list]
            })
            .addCase(createRole.rejected, (state, action) => {
                state.savingRole = null
                state.error = action.payload
            })
            .addCase(updateRole.pending, (state, action) => {
                state.savingRole = action.meta.arg.roleName
                state.error = null
            })
            .addCase(updateRole.fulfilled, (state, action) => {
                state.savingRole = null
                state.list = state.list.map((role) => (role.name === action.payload.name ? action.payload : role))
            })
            .addCase(updateRole.rejected, (state, action) => {
                state.savingRole = null
                state.error = action.payload
            })
            .addCase(updateRolePermissions.pending, (state, action) => {
                state.savingRole = `${action.meta.arg.roleName}:permissions`
                state.error = null
            })
            .addCase(updateRolePermissions.fulfilled, (state, action) => {
                state.savingRole = null
                state.list = state.list.map((role) => (role.name === action.payload.name ? action.payload : role))
            })
            .addCase(updateRolePermissions.rejected, (state, action) => {
                state.savingRole = null
                state.error = action.payload
            })
            .addCase(deleteRole.pending, (state, action) => {
                state.deletingRole = action.meta.arg
                state.error = null
            })
            .addCase(deleteRole.fulfilled, (state, action) => {
                state.deletingRole = null
                state.list = state.list.filter((role) => role.name !== action.payload)
            })
            .addCase(deleteRole.rejected, (state, action) => {
                state.deletingRole = null
                state.error = action.payload
            })
    },
})

export default rolesSlice.reducer
