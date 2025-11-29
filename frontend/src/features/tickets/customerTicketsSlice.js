import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../configs/axios";
import {
    normalizeTicket,
    normalizeTicketCollection,
} from "./ticketUtils";

const parseError = (error, fallback = "Unable to load tickets.") =>
    error?.message || fallback;

export const fetchCustomerTickets = createAsyncThunk(
    "customerTickets/fetch",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get("/tickets/my");
            return data.tickets || [];
        } catch (error) {
            return rejectWithValue(parseError(error));
        }
    }
);

export const createSupportTicket = createAsyncThunk(
    "customerTickets/create",
    async (payload, { rejectWithValue }) => {
        try {
            const { data } = await api.post("/tickets", payload);
            return data.ticket;
        } catch (error) {
            return rejectWithValue(
                parseError(error, "Unable to submit your ticket right now.")
            );
        }
    }
);

const initialState = {
    list: [],
    loading: false,
    error: null,
    initialized: false,
    creating: false,
};

const customerTicketsSlice = createSlice({
    name: "customerTickets",
    initialState,
    reducers: {
        upsertCustomerTicket(state, action) {
            const normalized = normalizeTicket(action.payload);
            if (!normalized) return;
            const index = state.list.findIndex((item) => item.id === normalized.id);
            if (index >= 0) {
                state.list[index] = normalized;
            } else {
                state.list.unshift(normalized);
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCustomerTickets.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCustomerTickets.fulfilled, (state, action) => {
                state.loading = false;
                state.list = normalizeTicketCollection(action.payload);
                state.initialized = true;
            })
            .addCase(fetchCustomerTickets.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.initialized = true;
            })
            .addCase(createSupportTicket.pending, (state) => {
                state.creating = true;
                state.error = null;
            })
            .addCase(createSupportTicket.fulfilled, (state, action) => {
                state.creating = false;
                const normalized = normalizeTicket(action.payload);
                if (normalized) {
                    state.list.unshift(normalized);
                }
            })
            .addCase(createSupportTicket.rejected, (state, action) => {
                state.creating = false;
                state.error = action.payload;
            });
    },
});

export const { upsertCustomerTicket } = customerTicketsSlice.actions;
export default customerTicketsSlice.reducer;
