// store.ts
import { configureStore } from "@reduxjs/toolkit";
import { createApi } from "@reduxjs/toolkit/query/react";
import { userApi } from "./userApi"; // Assuming you have defined userApi using createApi
import { notesApi } from "./notesApi"; // Assuming you have defined userApi using createApi
import userSlice from "./reducer/userReducer";
import { productsApi } from "./productsApi";

export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [notesApi.reducerPath]: notesApi.reducer,
    [productsApi.reducerPath]: productsApi.reducer,
    user: userSlice, // Assuming userReducer is created using createSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      userApi.middleware,
      notesApi.middleware,
      productsApi.middleware
    ), // Include the API middleware
});

export type RootState = ReturnType<typeof store.getState>;
