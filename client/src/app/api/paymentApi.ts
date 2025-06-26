import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "./baseApi";
import { Payment } from "../../lib/types";
import { LoadingPriority } from "../../layouts/uiSlice";

export const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["Payment"],
  endpoints: (builder) => ({
    fetchPayment: builder.query<Payment, void>({
      query: () => ({
        url: "/payments/mypayments",
        method: "GET",
      }),
      providesTags: ["Payment"],
    }),
    createPayment: builder.mutation<Payment, void>({
      query: () => ({
        url: "/payments/create-payment",
        method: "POST",
      }),
      invalidatesTags: ["Payment"],
      extraOptions: { loadingPriority: LoadingPriority.HIGH },
    }),
    createPaymentIntent: builder.mutation<Payment, void>({
      query: () => ({
        url: "/payments/create-payment-intent",
        method: "POST",
      }),
      onQueryStarted: async (_, { queryFulfilled }) => {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Failed to create payment intent", error);
        }
      },
      invalidatesTags: ["Payment"],
      extraOptions: { loadingPriority: LoadingPriority.HIGH },
    }),
    completePayment: builder.mutation<void, void>({
      query: () => ({
        url: `/payments/complete-payment`,
        method: "PUT",
      }),
      invalidatesTags: ["Payment"],
      extraOptions: { loadingPriority: LoadingPriority.HIGH },
    }),
  }),
});

export const {
  useCreatePaymentIntentMutation,
  useCompletePaymentMutation,
  useCreatePaymentMutation,
} = paymentApi;
