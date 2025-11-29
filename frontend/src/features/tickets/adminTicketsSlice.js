import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../configs/axios";
import {
    normalizeTicket,
    normalizeTicketCollection,
} from "./ticketUtils";

const parseError = (error, fallback = "Unable to load tickets.") =>
    error?.message || fallback;

export const fetchAdminTickets = createAsyncThunk(
    "adminTickets/fetch",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get("/tickets");
            return data.tickets || [];
        } catch (error) {
            return rejectWithValue(parseError(error));
        }
    }
);

export const createAdminTicket = createAsyncThunk(
    "adminTickets/create",
    async (payload, { rejectWithValue }) => {
        try {
            const { data } = await api.post("/tickets", payload);
            return data.ticket;
        } catch (error) {
            return rejectWithValue(parseError(error, "Unable to log the ticket."));
        }
    }
);

export const updateAdminTicket = createAsyncThunk(
    "adminTickets/update",
    async ({ id, updates }, { rejectWithValue }) => {
        try {
            const { data } = await api.put(`/tickets/${id}`, updates);
            return data.ticket;
        } catch (error) {
            return rejectWithValue(parseError(error, "Unable to update ticket."));
        }
    }
);

export const deleteAdminTicket = createAsyncThunk(
    "adminTickets/delete",
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/tickets/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(parseError(error, "Unable to delete ticket."));
        }
    }
);

const initialState = {
    list: [],
    loading: false,
    error: null,
    saving: false,
    deletingId: null,
};

const adminTicketsSlice = createSlice({
    name: "adminTickets",
    initialState,
    reducers: {
        upsertAdminTicket(state, action) {
            const normalized = normalizeTicket(action.payload);
            if (!normalized) return;
            const index = state.list.findIndex((ticket) => ticket.id === normalized.id);
            if (index >= 0) {
                state.list[index] = normalized;
            } else {
                state.list.unshift(normalized);
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminTickets.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdminTickets.fulfilled, (state, action) => {
                state.loading = false;
                state.list = normalizeTicketCollection(action.payload);
            })
            .addCase(fetchAdminTickets.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createAdminTicket.pending, (state) => {
                state.saving = true;
                state.error = null;
            })
            .addCase(createAdminTicket.fulfilled, (state, action) => {
                state.saving = false;
                const normalized = normalizeTicket(action.payload);
                if (normalized) {
                    state.list.unshift(normalized);
                }
            })
            .addCase(createAdminTicket.rejected, (state, action) => {
                state.saving = false;
                state.error = action.payload;
            })
            .addCase(updateAdminTicket.fulfilled, (state, action) => {
                const normalized = normalizeTicket(action.payload);
                if (!normalized) return;
                const index = state.list.findIndex((ticket) => ticket.id === normalized.id);
                if (index >= 0) {
                    state.list[index] = normalized;
                }
            })
            .addCase(deleteAdminTicket.pending, (state, action) => {
                state.deletingId = action.meta.arg;
            })
            .addCase(deleteAdminTicket.fulfilled, (state, action) => {
                state.deletingId = null;
                state.list = state.list.filter((ticket) => ticket.id !== action.payload);
            })
            .addCase(deleteAdminTicket.rejected, (state) => {
                state.deletingId = null;
            });
    },
});

export const { upsertAdminTicket } = adminTicketsSlice.actions;
export default adminTicketsSlice.reducer;
