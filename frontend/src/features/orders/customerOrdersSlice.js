import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../configs/axios";
import {
    extractOrderError,
    normalizeOrder,
    normalizeOrderCollection,
} from "./orderUtils";

const initialState = {
    list: [],
    loading: false,
    error: null,
    initialized: false,
    lastFetchedAt: null,
};

export const fetchCustomerOrders = createAsyncThunk(
    "customerOrders/fetch",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get("/orders/my");
            return data.orders || [];
        } catch (error) {
            return rejectWithValue(
                extractOrderError(error, "Unable to load your orders right now.")
            );
        }
    }
);

const customerOrdersSlice = createSlice({
    name: "customerOrders",
    initialState,
    reducers: {
        upsertCustomerOrder(state, action) {
            const normalized = normalizeOrder(action.payload);
            const existingIndex = state.list.findIndex(
                (order) => order.id === normalized.id
            );
            if (existingIndex >= 0) {
                state.list[existingIndex] = normalized;
            } else {
                state.list.unshift(normalized);
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCustomerOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCustomerOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.list = normalizeOrderCollection(action.payload);
                state.initialized = true;
                state.lastFetchedAt = Date.now();
            })
            .addCase(fetchCustomerOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.initialized = true;
            });
    },
});

export const { upsertCustomerOrder } = customerOrdersSlice.actions;
export default customerOrdersSlice.reducer;
