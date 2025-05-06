
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "../../app/api/baseApi";
import { Address } from "../../lib/types";
import { LoadingPriority } from "../../layouts/uiSlice";

export const addressApi = createApi({
  reducerPath: "addressApi",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["Address"],
  endpoints: (builder) => ({
    fetchAddress: builder.query<Address[], void>({
      query: () => ({ url: "/address/myaddresses", method: "GET" }),
      providesTags: (result) =>
        result
          ? [
              ...result.map((address) => ({
                type: "Address" as const,
                id: address.id,
              })),
              { type: "Address", id: "LIST" },
            ]
          : [{ type: "Address", id: "LIST" }],
      extraOptions: { loadingPriority: LoadingPriority.HIGH },
    }),
    getAddress: builder.query<Address, string>({
      query: (addressId) => ({
        url: `/address/myaddresses/${addressId}`,
        method: "GET",
      }),
      providesTags: (_, __, addressId) => [{ type: "Address", id: addressId }],
    }),
    createAddress: builder.mutation<void, Address>({
      query: (address) => ({
        url: "/address/create-address",
        method: "POST",
        body: address,
      }),
      invalidatesTags: [{ type: "Address", id: "LIST" }],
    }),
    updateAddress: builder.mutation<void, { id: string; address: Address }>({
      query: ({ id, address }) => ({
        url: `/address/update-address/${id}`,
        method: "PUT",
        body: address,
      }),
      invalidatesTags: (_, __, arg) => [
        { type: "Address", id: arg.id },
        { type: "Address", id: "LIST" },
      ],
    }),
  }),
});

export const { useFetchAddressQuery, useCreateAddressMutation, useUpdateAddressMutation, useGetAddressQuery } = addressApi;