import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../../configs/axios'

const coerceImageValue = (value) => {
    if (!value) return ''
    if (typeof value === 'string') return value.trim()
    if (typeof value === 'object') {
        return value.url || value.path || value.src || value.href || value.image || ''
    }
    return ''
}

const normalizeGallery = (input) => {
    if (Array.isArray(input)) {
        return input.map(coerceImageValue).filter(Boolean)
    }
    if (typeof input === 'string' && input.trim()) {
        try {
            const parsed = JSON.parse(input)
            if (Array.isArray(parsed)) {
                return parsed.map(coerceImageValue).filter(Boolean)
            }
        } catch (error) {
            // noop – treat as single string fallback
        }
        return [input.trim()]
    }
    return []
}

const normalizePortfolioItem = (item = {}) => {
    const normalizedGallery = normalizeGallery(item.gallery)
    const existingImages = Array.isArray(item.images)
        ? item.images.map(coerceImageValue).filter(Boolean)
        : []
    const mergedImages = Array.from(
        new Set([
            ...normalizedGallery,
            ...existingImages,
            coerceImageValue(item.image),
        ].filter(Boolean)),
    )
    const coverImage = mergedImages[0] || ''

    return {
        ...item,
        image: coverImage,
        gallery: normalizedGallery,
        images: mergedImages,
    }
}

const listKeyByType = {
    trust: 'trustHighlights',
    ideas: 'contentIdeas',
}

const initialState = {
    list: [],
    loading: false,
    error: null,
    pageContent: null,
    trustHighlights: [],
    contentIdeas: [],
    pageLoading: false,
    pageError: null,
}

const parseError = (error) => error?.response?.data?.message || error?.message || 'Request failed'

export const fetchPortfolio = createAsyncThunk('portfolio/fetchPortfolio', async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.get('/portfolio/projects')
        return (data.items || []).map(normalizePortfolioItem)
    } catch (error) {
        return rejectWithValue(parseError(error))
    }
})

export const addPortfolioItem = createAsyncThunk('portfolio/addPortfolioItem', async (payload, { rejectWithValue }) => {
    try {
        const { data } = await api.post('/portfolio/projects', payload)
        return normalizePortfolioItem(data.item)
    } catch (error) {
        return rejectWithValue(parseError(error))
    }
})

export const updatePortfolioItem = createAsyncThunk('portfolio/updatePortfolioItem', async ({ id, ...payload }, { rejectWithValue }) => {
    try {
        const { data } = await api.put(`/portfolio/projects/${id}`, payload)
        return normalizePortfolioItem(data.item)
    } catch (error) {
        return rejectWithValue(parseError(error))
    }
})

export const deletePortfolioItem = createAsyncThunk('portfolio/deletePortfolioItem', async (id, { rejectWithValue }) => {
    try {
        await api.delete(`/portfolio/projects/${id}`)
        return id
    } catch (error) {
        return rejectWithValue(parseError(error))
    }
})

export const fetchPortfolioPage = createAsyncThunk('portfolio/fetchPortfolioPage', async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.get('/portfolio/page/content')
        return data
    } catch (error) {
        return rejectWithValue(parseError(error))
    }
})

export const updatePortfolioPage = createAsyncThunk('portfolio/updatePortfolioPage', async (payload, { rejectWithValue }) => {
    try {
        const { data } = await api.put('/portfolio/page/content', payload)
        return data.content
    } catch (error) {
        return rejectWithValue(parseError(error))
    }
})

export const createPortfolioListItem = createAsyncThunk('portfolio/createPortfolioListItem', async ({ listType, payload }, { rejectWithValue }) => {
    try {
        const { data } = await api.post(`/portfolio/page/lists/${listType}`, payload)
        return { listType, item: data.item }
    } catch (error) {
        return rejectWithValue(parseError(error))
    }
})

export const updatePortfolioListItem = createAsyncThunk('portfolio/updatePortfolioListItem', async ({ listType, id, payload }, { rejectWithValue }) => {
    try {
        const { data } = await api.put(`/portfolio/page/lists/${listType}/${id}`, payload)
        return { listType, item: data.item }
    } catch (error) {
        return rejectWithValue(parseError(error))
    }
})

export const deletePortfolioListItem = createAsyncThunk('portfolio/deletePortfolioListItem', async ({ listType, id }, { rejectWithValue }) => {
    try {
        await api.delete(`/portfolio/page/lists/${listType}/${id}`)
        return { listType, id }
    } catch (error) {
        return rejectWithValue(parseError(error))
    }
})

const portfolioSlice = createSlice({
    name: 'portfolio',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPortfolio.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchPortfolio.fulfilled, (state, action) => {
                state.loading = false
                state.list = action.payload
            })
            .addCase(fetchPortfolio.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(addPortfolioItem.fulfilled, (state, action) => {
                state.list.unshift(normalizePortfolioItem(action.payload))
            })
            .addCase(updatePortfolioItem.fulfilled, (state, action) => {
                state.list = state.list.map((item) =>
                    item.id === action.payload.id ? normalizePortfolioItem(action.payload) : item,
                )
            })
            .addCase(deletePortfolioItem.fulfilled, (state, action) => {
                state.list = state.list.filter((item) => item.id !== action.payload)
            })
            .addCase(fetchPortfolioPage.pending, (state) => {
                state.pageLoading = true
                state.pageError = null
            })
            .addCase(fetchPortfolioPage.fulfilled, (state, action) => {
                state.pageLoading = false
                state.pageContent = action.payload.content
                state.trustHighlights = action.payload.trustHighlights || []
                state.contentIdeas = action.payload.contentIdeas || []
            })
            .addCase(fetchPortfolioPage.rejected, (state, action) => {
                state.pageLoading = false
                state.pageError = action.payload
            })
            .addCase(updatePortfolioPage.fulfilled, (state, action) => {
                state.pageContent = action.payload
            })
            .addCase(createPortfolioListItem.fulfilled, (state, action) => {
                const key = listKeyByType[action.payload.listType]
                if (!key) return
                state[key].push(action.payload.item)
            })
            .addCase(updatePortfolioListItem.fulfilled, (state, action) => {
                const key = listKeyByType[action.payload.listType]
                if (!key) return
                state[key] = state[key].map((item) => (item.id === action.payload.item.id ? action.payload.item : item))
            })
            .addCase(deletePortfolioListItem.fulfilled, (state, action) => {
                const key = listKeyByType[action.payload.listType]
                if (!key) return
                state[key] = state[key].filter((item) => item.id !== action.payload.id)
            })
    },
})

export default portfolioSlice.reducer
