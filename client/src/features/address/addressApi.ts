
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "../../app/api/baseApi";
import { Address } from "../../lib/types";

export const addressApi = createApi({
    reducerPath: "addressApi",
    baseQuery: baseQueryWithErrorHandling,
    tagTypes: ["Address"],
    endpoints: (builder) => ({
        fetchAddress: builder.query<Address[], void>({
            query: () => ({url: "/address/myaddresses", method: "GET"}),
            providesTags: ["Address"],
        })
    })
})

export const { useFetchAddressQuery } = addressApi;