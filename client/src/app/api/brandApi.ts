/* eslint-disable @typescript-eslint/no-explicit-any */

import { createApi } from "@reduxjs/toolkit/query/react";
import { Brand } from "../../lib/types";
import { baseQueryWithErrorHandling } from "./baseApi";


export const brandApi = createApi({
  baseQuery: baseQueryWithErrorHandling,
  reducerPath: "brandApi",
  tagTypes: ["Brand"],
  endpoints: (builder) => ({
    fetchAllBrands: builder.query<Brand[], void>({
      query: () => ({
        url: `/brand`,
        method: "GET",
      })
    }),
    fetchBrandsByCatId: builder.query<Brand[], number>({
      query: (catId) => ({
        url: `/brand?catId=${catId}`,
        method: "GET",
      }),
      transformResponse: (response: any) => response.data.getBrandsByCategoryId,
    }),
  }),
});

export const { useFetchAllBrandsQuery, useFetchBrandsByCatIdQuery } = brandApi;
