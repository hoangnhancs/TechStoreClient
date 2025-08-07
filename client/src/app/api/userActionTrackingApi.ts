import { createApi } from "@reduxjs/toolkit/query/react";
import { baseGraphqlQueryWithErrorHandling } from "./graphqlBaseApi";
import { UserActionTracking } from "../../lib/types";

export const userActionTrackingApi = createApi({
  reducerPath: "userActionTrackingApi",
  baseQuery: baseGraphqlQueryWithErrorHandling,
  tagTypes: ["UserActionTracking"],
  endpoints: (builder) => ({
    createUserActionTracking: builder.mutation<number, UserActionTracking>({
        query: ({ productId, actionType }) => ({
            document: `
                mutation CreateUserActionTracking($productId: String!, $actionType: String!) {
                    createUserActionTracking(productId: $productId, actionType: $actionType)
                }
                `,
            variables: {
                productId,
                actionType,
            },
        }),
        }),
    }),
});

export const { useCreateUserActionTrackingMutation } = userActionTrackingApi;