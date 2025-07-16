import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "./baseApi";
import { FilterTag } from "../../lib/types";

export const filterTagApi = createApi({
    reducerPath: "filterTagApi",
    baseQuery: baseQueryWithErrorHandling,
    tagTypes: ["FilterTag"],
    endpoints: (builder) => ({
        fetchFilterTagsByCatId: builder.query<FilterTag[], number>({
            query: (categoryId) => ({
                url: `/filtertag/filtertags?catId=${categoryId}`,
                method: "GET",
            }),
        }),
        fetchAllFilterTags: builder.query<FilterTag[], void>({
            query: () => ({
                url: `/filtertag/filtertags/all_filter_tags`,
                method: "GET",
            }),
     
        }),
    }),
})

export const { useFetchFilterTagsByCatIdQuery, useFetchAllFilterTagsQuery } = filterTagApi;