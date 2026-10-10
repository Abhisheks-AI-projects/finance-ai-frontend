import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import threadReducer from "./slices/threadSlice";
import transactionReducer from "./slices/transactionSlice";
import modalReducer from "./slices/modalSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    thread: threadReducer,
    transaction: transactionReducer,
    modal: modalReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
