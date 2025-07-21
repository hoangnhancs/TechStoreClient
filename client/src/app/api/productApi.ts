import { createApi } from "@reduxjs/toolkit/query/react";
import { CreateProductInput, Product } from "../../lib/types";
import { baseQueryWithErrorHandling } from "./baseApi";

export const productApi = createApi({
  reducerPath: "productApi",
  tagTypes: ["Product"],
  baseQuery: baseQueryWithErrorHandling, //custom base query with error handling
  endpoints: (builder) => ({
    fetchProducts: builder.query<Product[], void>({
      query: () => ({ url: "/products", method: "GET" }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Product" as const, id })),
              { type: "Product", id: "LIST" }, // dùng để refetch list khi tạo mới
            ]
          : [{ type: "Product", id: "LIST" }],
    }),
    fetchTop10Products: builder.query<Product[], void>({
      query: () => ({ url: "/products/top10", method: "GET" }),
      providesTags: (result) =>
        result
          ? result.map((p) => ({ type: "Product" as const, id: p.id }))
          : [],
    }),
    fetchProductsByCat: builder.query<Product[], number>({
      query: (categoryId) => ({
        url: `/products/category/${categoryId}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? result.map((p) => ({ type: "Product" as const, id: p.id }))
          : [],
    }),
    fetchProductById: builder.query<Product, string>({
      query: (id) => ({ url: `/products/${id}`, method: "GET" }),
      providesTags: (_, __, id) => [{ type: "Product", id }],
    }),
    createProduct: builder.mutation<Product, CreateProductInput>({
      query: (product) => {
        const formData = new FormData();
        formData.append("name", product.name);
        formData.append("description", product.description);
        formData.append("oldPrice", product.oldPrice.toString());
        formData.append("discount", product.discount.toString());
        formData.append("categoryId", product.categoryId);
        formData.append("brand", product.brand);
        formData.append("quantityInStock", product.quantityInStock.toString());

        // Main image
        if (product.mainImageFile) {
          formData.append("mainImageFile", product.mainImageFile);
        }

        // Detail images
        if (product.detailImageFiles && product.detailImageFiles.length > 0) {
          product.detailImageFiles.forEach((file) => {
            formData.append(`detailImageFiles`, file);
          });
        }

        // Filter tags (object)
        Object.entries(product.filterTags).forEach(([key, value]) => {
          formData.append(`filterTags[${key}]`, value);
        });

        // Attribute groups (array of objects)
        formData.append(
          "attributeGroupsJson",
          JSON.stringify(product.attributeGroups)
        );

        return {
          url: "/products/create",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),
    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({
        url: `/products?id=${id}`,
        method: "DELETE",
      }),
      // invalidatesTags: [{ type: "Product", id: "LIST" }],
    })
  }),
});

export const {
  useFetchProductsQuery,
  useFetchProductByIdQuery,
  useFetchTop10ProductsQuery,
  useFetchProductsByCatQuery,
  useCreateProductMutation,
  useDeleteProductMutation
} = productApi;
