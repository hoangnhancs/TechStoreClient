import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "./baseApi";
import { userApi } from "../../features/user/userApi";

export const photoApi = createApi({
  reducerPath: "photoApi",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["Photo", "User"],
  endpoints: (builder) => ({
    updatePhoto: builder.mutation<string, File>({
      query: (file) => {
        const formData = new FormData();
        formData.append("file", file);
        return {
          url: "/photo/update-photo",
          method: "PUT",
          body: formData,
        };
      },
    //   invalidatesTags: [{ type: "User", id: "PROFILE" }],
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          dispatch(userApi.endpoints.getCurrentUser.initiate());
        } catch (error) {
          console.error("Error updating photo:", error);
        }
      },
    }),
  }),
}); 

export const { useUpdatePhotoMutation } = photoApi;