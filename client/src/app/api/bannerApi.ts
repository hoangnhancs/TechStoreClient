import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "./baseApi";
import { BannerImage } from "../../lib/types";


export const bannerApi = createApi({
  reducerPath: "bannerApi",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["Banner"],
  endpoints: (builder) => ({
    fetchBanners: builder.query<BannerImage[], void>({
      query: () => ({
        url: "/banner",
        method: "GET",
      }),
      providesTags: ["Banner"],
    }),
    deleteBanner: builder.mutation<void, number[]>({
      query: (bannerIdS) => ({
        url: `/banner`,
        method: "DELETE",
        body: bannerIdS ,
      }),
      invalidatesTags: ["Banner"],
    }),
    addNewBanner: builder.mutation<BannerImage[], File[]>({
      query: (banners) => {
        const formData = new FormData();
        if (banners && banners.length > 0) {
          banners.forEach((file) => {
            formData.append("files", file); //files chinh la fromfrom o controller
          });
        }
        return {
          url: "/banner",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Banner"],
    }),
    
  }),
});

export const { useFetchBannersQuery, useDeleteBannerMutation, useAddNewBannerMutation } = bannerApi