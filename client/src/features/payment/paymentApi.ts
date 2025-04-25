import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "../../app/api/baseApi";
import { Payment } from "../../lib/types";


export const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery: baseQueryWithErrorHandling,
  endpoints: (builder) => ({
    createPaymentIntent: builder.mutation<Payment, void>({
      query: () => ({
        url: "/payments/create-payment-intent",
        method: "POST",
      }),
      onQueryStarted: async (_, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          console.log("Payment intent created successfully", data);      
        } catch (error) {
          console.error("Failed to create payment intent", error);
        }
      },
    }),
  }),
});

export const { useCreatePaymentIntentMutation } = paymentApi;
