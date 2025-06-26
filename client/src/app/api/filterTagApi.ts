import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "./baseApi";
import { FilterTag } from "../../lib/types";

export const filterTagApi = createApi({
    reducerPath: "filterTagApi",
    baseQuery: baseQueryWithErrorHandling,
    tagTypes: ["FilterTag"],
    endpoints: (builder) => ({
        fetchFilterTags: builder.query<FilterTag[], number>({
            query: (categoryId) => ({
                url: `/filtertag/filtertags?catId=${categoryId}`,
                method: "GET",
            }),
        }),
    }),
})

export const { useFetchFilterTagsQuery } = filterTagApi;