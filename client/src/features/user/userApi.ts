import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "../../app/api/baseApi";
import { BasicUser, User } from "../../lib/types";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["User", "Basket"],
  endpoints: (builder) => ({
    getCurrentUser: builder.query<User, void>({
      query: () => ({ url: "/account/user-info", method: "GET" }),
      providesTags: ["User"],
    }),
    login: builder.mutation<BasicUser, { email: string; password: string }>({
      query: ({ email, password }) => ({
        url: "/account/login",
        method: "POST",
        body: { email, password },
      }),

      invalidatesTags: ["User", "Basket"],
    }),
    logout: builder.mutation<void, void>({
      query: () => ({ url: "/account/logout", method: "POST" }),
      invalidatesTags: ["User", "Basket"],
    }),
    register: builder.mutation<User,{email: string;displayName: string;password: string;confirmPassword: string;}>({
      query: (credentials) => ({
        url: "/account/register",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User", "Basket"],
    }),
    resendConfirmEmail: builder.mutation<void, { email?: string, userId?: string | null }>({
      query: (credentials) => ({
        url: "/account/resendConfirmEmail",
        method: "POST",
        body: credentials,
      }),
    }),
    verifyEmail: builder.mutation<void, { userId: string; code: string }>({
      query: ({ userId, code }) => ({
        url: `/confirmEmail?userId=${userId}&code=${code}`,
        method: "GET",
      }),
    }),
    forgotPassword: builder.mutation<void, {email: string}>({
      query: (credentials) => ({
        url: "/forgotPassword",
        method: "POST",
        body: credentials,
      }),
    }),
    resetPassword: builder.mutation<void, {email: string; newPassword: string; resetCode: string; }>({
      query: (credentials) => ({
        url: "/resetPassword",
        method: "POST",
        body: credentials,
      }),
    })
  }),
});

export const {
  useGetCurrentUserQuery, 
  useLoginMutation, 
  useLogoutMutation, 
  useRegisterMutation, 
  useResendConfirmEmailMutation,
  useVerifyEmailMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = userApi