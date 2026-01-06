import { createApi } from "@reduxjs/toolkit/query/react";
import { CreateProductInput, GetResult, Product, UpdateProductInput } from "../../lib/types";
import { baseQueryWithErrorHandling } from "./baseApi";

export const productApi = createApi({
  reducerPath: "productApi",
  tagTypes: ["Product"],
  baseQuery: baseQueryWithErrorHandling, //custom base query with error handling
  endpoints: (builder) => ({
    fetchProducts: builder.query<GetResult<Product>, void>({
      query: () => ({ url: "/search", method: "GET" }),
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ id }) => ({ type: "Product" as const, id })),
              { type: "Product", id: "LIST" }, // dùng để refetch list khi tạo mới
            ]
          : [{ type: "Product", id: "LIST" }],
    }),
    fetchTop10Products: builder.query<Product[], void>({
      query: () => ({ url: "/search/top10", method: "GET" }),
      providesTags: (result) =>
        result
          ? result.map((p) => ({ type: "Product" as const, id: p.id }))
          : [],
    }),
    fetchProductsByCat: builder.query<GetResult<Product>, number>({
      query: (categoryId) => ({
        url: `/search/${categoryId}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result?.results
          ? result.results.map((p) => ({ type: "Product" as const, id: p.id }))
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
        formData.append("price", product.price.toString());
        formData.append("discount", product.discount.toString());
        formData.append("categoryId", product.categoryId);
        formData.append("brandId", product.brandId);
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
        product.productFilterTagValues.forEach((ftv, idx) => {
          formData.append(`productFilterTagValues[${idx}].filterTagId`, ftv.filterTagId.toString());
          formData.append(`productFilterTagValues[${idx}].filterTagValueId`, ftv.filterTagValueId.toString());
        });

        product.attributeGroups.forEach((attrGroup, index) => {
          formData.append(`attributes[${index}].attributeType`, attrGroup.attributeType);
          formData.append(`attributes[${index}].name`,  attrGroup.name);
          formData.append(`attributes[${index}].value`,  attrGroup.value);
        });

        return {
          url: "/products",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),
    updateProduct: builder.mutation<Product,{ product: UpdateProductInput; id: string }>({
      query: ({ product, id }) => {
        const formData = new FormData();
        formData.append("name", product.name);
        formData.append("description", product.description);
        formData.append("oldPrice", product.oldPrice.toString());
        formData.append("price", product.price.toString());
        formData.append("discount", product.discount.toString());
        formData.append("categoryId", product.categoryId);
        formData.append("brandId", product.brandId);
        formData.append("quantityInStock", product.quantityInStock.toString());

        // Main image
        if (product.mainImageFile) {
          formData.append("mainImageFile", product.mainImageFile);
        }
        if (product.mainImageUrl) {
          formData.append("mainImageUrl", product.mainImageUrl);
        }

        // Detail images
        if (product.detailImageFiles && product.detailImageFiles.length > 0) {
          product.detailImageFiles.forEach((file) => {
            formData.append(`detailImageFiles`, file);
          });
        }
        if (product.detailImageUrls && product.detailImageUrls.length > 0) {
          product.detailImageUrls.forEach((url) => {
            formData.append(`detailImageUrls`, url);
          });
        }

        // Filter tags (object)
        product.productFilterTagValues.forEach((ftv, idx) => {
          formData.append(`productFilterTagValues[${idx}].filterTagId`, ftv.filterTagId.toString());
          formData.append(`productFilterTagValues[${idx}].filterTagValueId`, ftv.filterTagValueId.toString());
        });

        product.attributeGroups.forEach((attrGroup, index) => {
          formData.append(`attributes[${index}].attributeType`, attrGroup.attributeType);
          formData.append(`attributes[${index}].name`,  attrGroup.name);
          formData.append(`attributes[${index}].value`,  attrGroup.value);
        });

        return {
          url: `/products/${id}`,
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: (_result, _error, { id }) => [{ type: "Product", id }],
    }),
    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({
        url: `/products?id=${id}`,
        method: "DELETE",
      }),
      // invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),
    fetchSuggestionProducts: builder.query<Product[], void>({
      query: () => ({ url: "/products/suggestion", method: "GET" }),
      providesTags: (result) =>
        result
          ? result.map((p) => ({ type: "Product" as const, id: p.id }))
          : [],
    }),
  }),
});

export const {
  useFetchProductsQuery,
  useFetchProductByIdQuery,
  useFetchTop10ProductsQuery,
  useFetchProductsByCatQuery,
  useLazyFetchProductsByCatQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation, 
  useFetchSuggestionProductsQuery
} = productApi;
