import { createSlice } from "@reduxjs/toolkit";

interface ModalState {
  isSignInOpen: boolean;
  isSignUpOpen: boolean;
}

const initialState: ModalState = {
  isSignInOpen: false,
  isSignUpOpen: false,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openSignIn: (state) => {
      state.isSignInOpen = true;
      state.isSignUpOpen = false;
    },
    closeSignIn: (state) => {
      state.isSignInOpen = false;
    },
    openSignUp: (state) => {
      state.isSignUpOpen = true;
      state.isSignInOpen = false;
    },
    closeSignUp: (state) => {
      state.isSignUpOpen = false;
    },
  },
});

export const { openSignIn, closeSignIn, openSignUp, closeSignUp } =
  modalSlice.actions;
export default modalSlice.reducer;
