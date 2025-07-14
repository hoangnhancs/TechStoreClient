import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "./baseApi";
import { Category } from "../../lib/types";

export const categoryApi = createApi({
    reducerPath: "categoryApi",
    baseQuery: baseQueryWithErrorHandling,
    tagTypes: ["Category"],
    endpoints: (builder) => ({
        fetchCategories: builder.query<Category[], void>({
            query: () => ({
                url: "/category",
                method: "GET"
            })
        })
    })
})

export const { useFetchCategoriesQuery } = categoryApi;