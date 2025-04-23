import { createApi } from "@reduxjs/toolkit/query/react";
import { Product } from "../../lib/types";
import { baseQueryWithErrorHandling } from "../../app/api/baseApi";

export const productApi = createApi({
    reducerPath: "productApi",
    baseQuery: baseQueryWithErrorHandling, //custom base query with error handling
    endpoints: (builder) => ({
        fetchProducts: builder.query<Product[], void>({
            query: () => ({url: "/products", method: "GET"}),
        }),
        fetchProductById: builder.query<Product, string>({
            query: (id) => ({url: `/products/${id}`, method: "GET"}),
        }),
    })
})

export const {useFetchProductsQuery, useFetchProductByIdQuery} = productApi
