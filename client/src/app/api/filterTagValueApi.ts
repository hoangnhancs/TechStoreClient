
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "./baseApi";
import { FilterTagValue } from "../../lib/types";

export const filterTagValueApi = createApi({
  reducerPath: "tagFilterValueApi",
  baseQuery: baseQueryWithErrorHandling,
  endpoints: (builder) => ({
    fetchTagFilterValues: builder.query<FilterTagValue[], number>({
      query: (categoryId) => ({
        url: `/filtertagvalue/filtertagvalues?catId=${categoryId}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useFetchTagFilterValuesQuery } = filterTagValueApi;