import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import axios from "axios";
import { GetAllProductsQuery, productsResponse } from "../types/api-types";
import { Category, Note, Product, User } from "../types/types";

// const baseUrl = process.env.NODE_ENV === 'production' 
//   ? 'https://notes-fullstack-xgv2.onrender.com/api/' 
//   : '/api/';

  const baseUrl = "https://notes-fullstack-backend.onrender.com/api/"

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    getAllProducts: builder.query<productsResponse, GetAllProductsQuery>({
      query: ({ category, subcategory, brand, sort, priceMin, priceMax, search }) => {
        let url = `getAllProducts?`;

        // Construct the query string with the provided parameters
        if (category) url += `category=${category}&`;
        if (subcategory) url += `subcategory=${subcategory}&`;
        if (brand) url += `brand=${brand}&`;
        if (sort) url += `sort=${sort}&`;
        if (priceMin) url += `priceMin=${priceMin}&`;
        if (priceMax) url += `priceMax=${priceMax}&`;
        if (search) url += `search=${search}&`;
        return {
          url: url.slice(0, -1), // Remove the trailing '&' if there are no more query parameters
          withCredentials: true,
          method: "GET",
        };
      },
    }),

    getAllCategories: builder.query<Category[], void>({
      query: () => ({
        url: "getAllCategories",
        withCredentials: true,
        method: "GET",
      }),
    }),

    createProduct: builder.mutation<productsResponse, FormData>({
      query: (formData) => ({
        url: "createProduct",
        method: "POST",
        body: formData,
        withCredentials: true,
      }),
    }),

  }),
});

export const { useGetAllProductsQuery, useGetAllCategoriesQuery, useCreateProductMutation } = productsApi;

// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import axios from "axios";
// import {
//     GetAllProductsQuery, productsResponse,
// } from "../types/api-types";
// import { Category, Note, Product, User } from "../types/types";

// export const productsApi = createApi({
//     reducerPath: "productsApi",
//     baseQuery: fetchBaseQuery({
//       baseUrl: `/api/`,
//     }),
//     endpoints: (builder) => ({
//       getAllProducts: builder.query<productsResponse, GetAllProductsQuery>({
//         query: ({ category, subcategory, brand }) => {
//           let url = `getAllProducts?`;

//           // Construct the query string with the provided parameters
//           if (category) url += `category=${category}&`;
//           if (subcategory) url += `subcategory=${subcategory}&`;
//           if (brand) url += `brand=${brand}&`;

//           return {
//             url: url.slice(0, -1), // Remove the trailing '&' if there are no more query parameters
//             withCredentials: true,
//             method: "GET",
//           };
//           // return {
//           //   url: `${url}${queryParams.toString()}`,
//           //   withCredentials: true,
//           //   method: "GET",
//           // };
//         },
//       }),

//       getAllCategories: builder.query<Category[], void>({
//         query: () => ({
//           url: "getAllCategories",
//           withCredentials: true,
//           method: "GET",
//         }),
//       }),
//     }),
//   });

// export const {
//     useGetAllProductsQuery,
//     useGetAllCategoriesQuery
// } = productsApi;
