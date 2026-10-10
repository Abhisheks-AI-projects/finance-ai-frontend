import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";
import type { UserMetadata } from "@/lib/types";

interface AuthState {
  user: UserMetadata | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

export const fetchUserMetadata = createAsyncThunk(
  "auth/fetchUserMetadata",
  async () => {
    const response = await api.get("/auth/me");
    return response.data;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuth: (state) => {
      state.user = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserMetadata.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserMetadata.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserMetadata.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch user data";
      });
  },
});

export const { clearAuth } = authSlice.actions;
export default authSlice.reducer;
