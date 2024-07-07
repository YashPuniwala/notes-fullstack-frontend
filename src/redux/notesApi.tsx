import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import axios from "axios";
import {
  MessageResponse,
  NotesResponse,
  UserResponse,
} from "../types/api-types";
import { Note, User } from "../types/types";

export const notesApi = createApi({
  reducerPath: "notesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `/api/`,
  }),
  //   tagTypes: ["users"],
  endpoints: (builder) => ({
    getAllNotes: builder.query<NotesResponse, void>({
      query: () => ({
        url: "getNotes",
        withCredentials: true,
        method: "GET",
      }),
    }),
    createNotes: builder.mutation<NotesResponse, Note>({
      query: (note) => ({
        url: "createNote",
        withCredentials: true,
        method: "POST",
        body: note,
      }),
    }),
    updateNotes: builder.mutation<NotesResponse, Note>({
      query: ({ title, content, id }) => ({
        url: `updateNote/${id}`,
        withCredentials: true,
        method: "PUT",
        body: { title, content },
      }),
    }),
    deleteNotes: builder.mutation<NotesResponse, string>({
      query: (id) => ({
        url: `deleteNote/${id}`,
        withCredentials: true,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetAllNotesQuery,
  useCreateNotesMutation,
  useUpdateNotesMutation,
  useDeleteNotesMutation,
} = notesApi;