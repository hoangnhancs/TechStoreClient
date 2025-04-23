import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "../../app/api/baseApi";
import { Basket } from "../../lib/types";
import { basketApi } from "../basket/basketApi";

export const orderApi = createApi({
    reducerPath: 'orderApi',
    baseQuery: baseQueryWithErrorHandling,
    endpoints: (builder) => ({
        createPaymentIntent: builder.mutation<Basket, void>({
            query: () => ({
                url: '/api/payments/create-payment-intent',
                method: 'POST',
            }),
            onQueryStarted: async (_, {dispatch, queryFulfilled}) => {
                try {
                    const {data} = await queryFulfilled
                    dispatch (
                        basketApi.util.updateQueryData('fetchBasket', undefined, (draft) => {
                            draft.clientSecret = data.clientSecret
                        })
                    )
                } catch (error) {
                    console.error("Failed to create payment intent", error)
                }
            }
        }),
    }),
})

export const { useCreatePaymentIntentMutation } = orderApi