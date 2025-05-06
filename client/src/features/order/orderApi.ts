import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "../../app/api/baseApi";
import { CreateOrderInput, Order } from "../../lib/types";
import { LoadingPriority } from "../../layouts/uiSlice";


export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["Order"],
  endpoints: (builder) => ({
    fetchOrder: builder.query<Order[], void>({
      query: () => ({ url: "/order/myorders", method: "GET" }),
      providesTags: (result) =>
        result
          ? [
              ...result.map((order) => ({ type: "Order" as const, id: order.id })),
              { type: "Order", id: "LIST" },
            ]
          : [{ type: "Order", id: "LIST" }],
    }),
    createOrder: builder.mutation<Order, CreateOrderInput>({
      query: (input) => ({
        url: "/order/createorder",
        method: "POST",
        body: input,
      }),
      invalidatesTags: [{ type: "Order", id: "LIST" }],
      extraOptions: { loadingPriority: LoadingPriority.HIGH }, // Set loading priority for this mutation
    }),
    getOrderDetails: builder.query<Order, string>({
      query: (orderId) => ({
        url: `/order/myorders/${orderId}`,
        method: "GET",
      }),
      providesTags: (_, __, orderId) => [
        { type: "Order", id: orderId },
      ],
    }),
  }),
}); 

export const { useFetchOrderQuery, useCreateOrderMutation, useGetOrderDetailsQuery } = orderApi;