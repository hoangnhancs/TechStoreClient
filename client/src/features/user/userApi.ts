import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "../../app/api/baseApi";
import { BasicUser, User } from "../../lib/types";
import { basketApi } from "../../app/api/basketApi";
import { setCurrentUser, setUserInitialized } from "./userSlice";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["User", "Basket", "NotificationGroup"],
  refetchOnMountOrArgChange: true, // Khi tải lại trang/chuyển trang
  refetchOnFocus: true, // Khi quay lại tab
  refetchOnReconnect: true, // Khi có kết nối mạng trở lại
  endpoints: (builder) => ({
    getCurrentUser: builder.query<User, void>({
      query: () => ({ url: "/account/user-info", method: "GET" }),
      providesTags: ["User"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCurrentUser(data));
        } catch {
          // not logged in
        } finally {
          dispatch(setUserInitialized());
        }
      },
    }),
    login: builder.mutation<BasicUser, { email: string; password: string }>({
      query: ({ email, password }) => ({
        url: "/account/login",
        method: "POST",
        body: { email, password },
      }),

      invalidatesTags: ["User", "Basket", "NotificationGroup"],
    }),
    logout: builder.mutation<void, void>({
      query: () => ({ url: "/account/logout", method: "POST" }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(userApi.util.resetApiState());
          dispatch(basketApi.util.resetApiState());
        } catch (error) {
          console.error("Logout failed:", error);
        }
      },
      invalidatesTags: ["User", "Basket"],
    }),
    register: builder.mutation<
      BasicUser,
      {
        email: string;
        displayName: string;
        password: string;
        confirmPassword: string;
      }
    >({
      query: (credentials) => ({
        url: "/account/register",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User", "Basket"],
    }),
    changePasword: builder.mutation<
      void,
      { currentPassword: string; newPassword: string; confirmPassword: string }
    >({
      query: (credentials) => ({
        url: "/account/change-password",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User", "Basket"],
    }),
    resendConfirmEmail: builder.mutation<
      void,
      { email?: string; userId?: string | null }
    >({
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
    forgotPassword: builder.mutation<void, { email: string }>({
      query: (credentials) => ({
        url: "/forgotPassword",
        method: "POST",
        body: credentials,
      }),
    }),
    resetPassword: builder.mutation<
      void,
      { email: string; newPassword: string; resetCode: string }
    >({
      query: (credentials) => ({
        url: "/resetPassword",
        method: "POST",
        body: credentials,
      }),
    }),
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
  useChangePaswordMutation,
} = userApi