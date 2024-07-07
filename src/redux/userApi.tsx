import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { MessageResponse, UserResponse } from "../types/api-types";
import { User } from "../types/types";

const baseUrl = 'https://notes-fullstack-backend.onrender.com/api/';
// const baseUrl = 'http://localhost:4000/api/';

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    credentials: 'include',
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<MessageResponse, User>({
      query: (user) => ({
        url: "login",
        method: "POST",
        body: user,
      }),
    }),
    register: builder.mutation<MessageResponse, User>({
      query: (user) => ({
        url: "register",
        method: "POST",
        body: user,
      }),
    }),
    logout: builder.mutation<UserResponse, void>({
      query: () => ({
        url: "logout",
        method: "GET"
      }),
    }),
    getUser: builder.query<UserResponse, void>({
      query: () => ({
        url: "user",
        method: "GET"
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useGetUserQuery, useLogoutMutation } = userApi;