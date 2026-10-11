import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/api";
import type { Transaction } from "@/lib/types";

interface Budget {
  id: string;
  amount: number;
  spent: number;
  remaining: number;
  start_date: string;
  end_date: string;
}

interface DashboardData {
  month_income: number;
  month_expense: number;
  balance: number;
  transaction_count: number;
  budget: Budget | null;
}

interface TransactionState {
  transactions: Transaction[];
  dashboard: DashboardData | null;
  loading: boolean;
  error: string | null;
}

const initialState: TransactionState = {
  transactions: [],
  dashboard: null,
  loading: false,
  error: null,
};

export const fetchDashboard = createAsyncThunk(
  "transaction/fetchDashboard",
  async () => {
    const response = await api.get("/finance/dashboard");
    return response.data;
  }
);

export const fetchTransactions = createAsyncThunk(
  "transaction/fetchTransactions",
  async () => {
    const response = await api.get("/finance/transactions");
    return response.data.transactions;
  }
);

const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    setTransactions: (state, action: PayloadAction<Transaction[]>) => {
      state.transactions = action.payload;
    },
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.transactions.unshift(action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboard = action.payload;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch dashboard";
      })
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch transactions";
      });
  },
});

export const { setTransactions, addTransaction, setLoading, setError } =
  transactionSlice.actions;
export default transactionSlice.reducer;
