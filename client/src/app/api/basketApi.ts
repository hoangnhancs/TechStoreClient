import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "./baseApi";
import { Basket } from "../../lib/types";

export const basketApi = createApi({
  reducerPath: "basketApi",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["Basket"],
  endpoints: (builder) => ({
    fetchBasket: builder.query<Basket, void>({
      query: () => ({ url: "/basket", method: "GET" }),
      providesTags: ["Basket"], // Set loading priority for this query
    }),
    addBasketItem: builder.mutation<Basket, { productId: string; quantity: number }>({
      query: ({ productId, quantity }) => ({
        url: "/basket/mybasket/items",
        method: "POST",
        body: {
          productId,
          quantity,
        },
      }),
      invalidatesTags: ["Basket"], 
      // async onQueryStarted(
      //   { productId, quantity },
      //   { dispatch, queryFulfilled }
      // ) {
      //   const patchResult = dispatch(
      //     basketApi.util.updateQueryData("fetchBasket", undefined, (draft) => {
      //       //draf la ban nhap, minh sua draf truoc awaitfulfilled
      //       if (!draft) return;
      //       if (!draft.items) {
      //         draft.items = [];
      //       }

      //       const existingItem = draft.items.find(
      //         (item) => item.productId === productId
      //       );

      //       if (existingItem) {
      //         existingItem.quantity += quantity;
      //       } else {
      //         draft.items.push({
      //           productId,
      //           quantity,
      //           productName: queryFulfilled.data..productName, // Assuming productName is returned in the response
      //           price: product.price,
      //           imageUrl: product.imageUrl,
      //           category: product.category,
      //           brand: product.brand,
      //         });
      //       }
      //     })
      //   );

      //   try {
      //     await queryFulfilled; //doi user tra ve ket qua
      //   } catch (error) {
      //     patchResult.undo(); //neu bi loi thi undo
      //     console.error("Failed to add item to basket", error);
      //   }
      // },
    }),
    removeBasketItem: builder.mutation<Basket, { productId: string; quantity: number }>({
      query: ({ productId, quantity }) => ({
        url: `/basket/mybasket/items/${productId}?quantity=${quantity}`,
        method: "DELETE",
      }),
      async onQueryStarted(
        { productId, quantity },
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          basketApi.util.updateQueryData("fetchBasket", undefined, (draft) => {
            //draf la ban nhap, minh sua draf truoc awaitfulfilled
            if (!draft) return;
            if (!draft.items) {
              draft.items = [];
            }

            const existingItem = draft.items.find(
              (item) => item.productId === productId
            );

            if (existingItem) {
              existingItem.quantity -= quantity;
              if (existingItem.quantity <= 0) {
                draft.items = draft.items.filter(
                  (item) => item.productId !== productId
                );
              }
            }
          })
        );
        try {
          await queryFulfilled; //doi user tra ve ket qua
        } catch (error) {
          patchResult.undo(); //neu bi loi thi undo
          console.error("Failed to remove item from basket", error);
        }
      },
    }),
    removePermanentlyBasketItems: builder.mutation<Basket, { productIds: string[] }>({
      query: ({ productIds }) => ({
        url: "basket/mybasket/remove_items",
        method: "POST",
        body: {
          productIds,
        },
      }),
      invalidatesTags: ["Basket"],
    }),
  }),
});

export const {
  useFetchBasketQuery,
  useAddBasketItemMutation,
  useRemoveBasketItemMutation,
  useRemovePermanentlyBasketItemsMutation,
} = basketApi;
