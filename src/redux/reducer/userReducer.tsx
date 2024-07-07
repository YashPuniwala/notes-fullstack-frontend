import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { UserReducerInitialState } from "../../types/reducer-types";
import { User } from "../../types/types";

const initialState: UserReducerInitialState = {
  loading: false,
  user: null,
  message: "",
  error: "",
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload; // Set the user in the state after login
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.user = null; // Clear the user from the state after logout
      state.isAuthenticated = false;
    },
    clearError: (state) => {
      state.loading = false;
      state.error = "";
      state.message = "";
    },
    clearMessage: (state) => {
      state.loading = false;
      state.error = "";
      state.message = "";
    },
  },
});

export const { clearError, clearMessage, setUser, clearUser } =
  userSlice.actions;

export default userSlice.reducer;
