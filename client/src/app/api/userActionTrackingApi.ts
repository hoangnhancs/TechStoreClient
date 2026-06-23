import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "./baseApi";
import { UserActionTracking } from "../../lib/types";

export const userActionTrackingApi = createApi({
  reducerPath: "userActionTrackingApi",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["UserActionTracking"],
  endpoints: (builder) => ({
    createUserActionTracking: builder.mutation<void, UserActionTracking>({
      query: ({ productId, actionType }) => ({
        url: "/userActionTracking",
        method: "POST",
        body: { productId, actionType },
      }),
    }),
  }),
});

export const { useCreateUserActionTrackingMutation } = userActionTrackingApi;
