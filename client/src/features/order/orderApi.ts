import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "../../app/api/baseApi";
import { CreateOrderInput, Order } from "../../lib/types";


export const orderApi = createApi({
    reducerPath: "orderApi",
    baseQuery: baseQueryWithErrorHandling,
    tagTypes: ["Order"],
    endpoints: (builder) => ({
        createOrder: builder.mutation<Order, CreateOrderInput>({
        query: (input) => ({
                url: "/order/createorder",
                method: "POST",
                body: input,
            }),
        }),
    }),
}); 

export const { useCreateOrderMutation } = orderApi;