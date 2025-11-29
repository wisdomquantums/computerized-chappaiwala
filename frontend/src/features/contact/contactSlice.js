import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../../configs/axios'

const parseError = (error) => error?.response?.data?.message || error?.message || 'Request failed'

const normalizeLines = (lines) => {
    if (Array.isArray(lines)) {
        return lines.map((line) => (typeof line === 'string' ? line : String(line || ''))).filter(Boolean)
    }
    if (typeof lines === 'string' && lines.trim()) {
        try {
            const parsed = JSON.parse(lines)
            if (Array.isArray(parsed)) {
                return parsed.map((line) => (typeof line === 'string' ? line : String(line || ''))).filter(Boolean)
            }
        } catch {
            return [lines.trim()]
        }
        return []
    }
    return []
}

const normalizeCard = (card = {}) => ({
    ...card,
    lines: normalizeLines(card.lines),
})

const initialState = {
    cards: [],
    cardsLoading: false,
    cardsError: null,
    pageContent: null,
    pageLoading: false,
    pageError: null,
}

export const fetchContactCards = createAsyncThunk('contact/fetchCards', async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.get('/contact/cards')
        return (data.cards || []).map(normalizeCard)
    } catch (error) {
        return rejectWithValue(parseError(error))
    }
})

export const createContactCard = createAsyncThunk('contact/createCard', async (payload, { rejectWithValue }) => {
    try {
        const { data } = await api.post('/contact/cards', payload)
        return normalizeCard(data.card)
    } catch (error) {
        return rejectWithValue(parseError(error))
    }
})

export const updateContactCard = createAsyncThunk('contact/updateCard', async ({ id, ...payload }, { rejectWithValue }) => {
    try {
        const { data } = await api.put(`/contact/cards/${id}`, payload)
        return normalizeCard(data.card)
    } catch (error) {
        return rejectWithValue(parseError(error))
    }
})

export const deleteContactCard = createAsyncThunk('contact/deleteCard', async (id, { rejectWithValue }) => {
    try {
        await api.delete(`/contact/cards/${id}`)
        return id
    } catch (error) {
        return rejectWithValue(parseError(error))
    }
})

export const fetchContactPage = createAsyncThunk('contact/fetchPage', async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.get('/contact/page/content')
        return {
            content: data.content || null,
            cards: (data.cards || []).map(normalizeCard),
        }
    } catch (error) {
        return rejectWithValue(parseError(error))
    }
})

export const updateContactPage = createAsyncThunk('contact/updatePage', async (payload, { rejectWithValue }) => {
    try {
        const { data } = await api.put('/contact/page/content', payload)
        return data.content
    } catch (error) {
        return rejectWithValue(parseError(error))
    }
})

const contactSlice = createSlice({
    name: 'contact',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchContactCards.pending, (state) => {
                state.cardsLoading = true
                state.cardsError = null
            })
            .addCase(fetchContactCards.fulfilled, (state, action) => {
                state.cardsLoading = false
                state.cards = action.payload
            })
            .addCase(fetchContactCards.rejected, (state, action) => {
                state.cardsLoading = false
                state.cardsError = action.payload
            })
            .addCase(createContactCard.fulfilled, (state, action) => {
                state.cards.push(action.payload)
            })
            .addCase(updateContactCard.fulfilled, (state, action) => {
                state.cards = state.cards.map((card) => (card.id === action.payload.id ? action.payload : card))
            })
            .addCase(deleteContactCard.fulfilled, (state, action) => {
                state.cards = state.cards.filter((card) => card.id !== action.payload)
            })
            .addCase(fetchContactPage.pending, (state) => {
                state.pageLoading = true
                state.pageError = null
            })
            .addCase(fetchContactPage.fulfilled, (state, action) => {
                state.pageLoading = false
                state.pageContent = action.payload.content
                state.cards = action.payload.cards
            })
            .addCase(fetchContactPage.rejected, (state, action) => {
                state.pageLoading = false
                state.pageError = action.payload
            })
            .addCase(updateContactPage.fulfilled, (state, action) => {
                state.pageContent = action.payload
            })
    },
})

export default contactSlice.reducer
