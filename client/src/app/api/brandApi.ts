/* eslint-disable @typescript-eslint/no-explicit-any */

import { createApi } from "@reduxjs/toolkit/query/react";
import { Brand } from "../../lib/types";
import { baseGraphqlQueryWithErrorHandling } from "./graphqlBaseApi";

export const brandApi = createApi({
  baseQuery: baseGraphqlQueryWithErrorHandling,
  reducerPath: "brandApi",
  tagTypes: ["Brand"],
  endpoints: (builder) => ({
    fetchAllBrands: builder.query<Brand[], void>({
      query: () => ({
        document: `query GetAllBrands {
          getAllBrands {
            id
            name
            categoryId
            imageUrl
          }
        }`,
      }),

      transformResponse: (response: any) => response.data.getAllBrands,
    }),
    fetchBrandsByCatId: builder.query<Brand[], number>({
      query: (catId) => ({
        document: `query GetBrandsByCategoryId {
          getBrandsByCategoryId (categoryId: ${catId}) {
            id
            name
            categoryId
            imageUrl
          }
        }`,
      }),
      transformResponse: (response: any) => response.data.getBrandsByCategoryId,
    }),
  }),
});

export const { useFetchAllBrandsQuery, useFetchBrandsByCatIdQuery } = brandApi;
