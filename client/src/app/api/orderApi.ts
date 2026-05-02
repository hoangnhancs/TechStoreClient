import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "./baseApi";
import { CreateOrderInput, Order } from "../../lib/types";
import { LoadingPriority } from "../../layouts/uiSlice";
import { productApi } from "./productApi";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["Product", "Order"],
  endpoints: (builder) => ({
    fetchOrder: builder.query<Order[], void>({
      query: () => ({ url: "/orders", method: "GET" }),
      providesTags: (result) =>
        result
          ? [
              ...result.map((order) => ({
                type: "Order" as const,
                id: order.id,
              })),
              { type: "Order", id: "LIST" },
            ]
          : [{ type: "Order", id: "LIST" }],
    }),
    createOrder: builder.mutation<Order, CreateOrderInput>({
      query: (input) => ({
        url: "/orders",
        method: "POST",
        body: input,
      }),
      invalidatesTags: [{ type: "Order", id: "LIST" }],
      extraOptions: { loadingPriority: LoadingPriority.HIGH }, // Set loading priority for this mutation
      async onQueryStarted(arg, {dispatch, queryFulfilled}) {
        try {
          const { data } = await queryFulfilled;
          if (data.status === "Completed") {
            const productIds = arg.items.map((item) => item.productId);
            dispatch(
            productApi.util.invalidateTags([
              ...productIds.map((id) => ({ type: "Product" as const, id })),
            ]));
          }
        } catch (error) {
          console.error("Error creating order:", error);
        }
      }
    }),
    getOrderDetails: builder.query<Order, string>({
      query: (orderId) => ({
        url: `/orders/${orderId}`,
        method: "GET",
      }),
      providesTags: (_, __, orderId) => [{ type: "Order", id: orderId }],
    }),
    getOrderDetailsWithHistoryAndShipment: builder.query<Order, string>({
      query: (orderId) => ({
        url: `/orders/${orderId}/with-history`,
        method: "GET",
      }),
      providesTags: (_, __, orderId) => [{ type: "Order", id: orderId }],
    }),
    getListOrdersInDateRange: builder.query<Order[], { startDate: string; endDate: string }>({
      query: ({ startDate, endDate }) => ({
        url: "/orders/list-orders?startDate=" + startDate + "&endDate=" + endDate,
        method: "GET",
      }),
      providesTags: (result) => result ? 
        [...result.map((order) => 
          ({ type: "Order" as const, id: order.id })),
          { type: "Order", id: "LIST" }
        ] : [{ type: "Order", id: "LIST" }]
    }),
  }),
});

export const {
  useFetchOrderQuery,
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
  useGetOrderDetailsWithHistoryAndShipmentQuery,
  useGetListOrdersInDateRangeQuery,
  useLazyGetListOrdersInDateRangeQuery,
} = orderApi;
