import { createApi } from "@reduxjs/toolkit/query/react";
import { CreateAndUpdateProductInput, GetResult, Product } from "../../lib/types";
import { baseQueryWithErrorHandling } from "./baseApi";

export const productApi = createApi({
  reducerPath: "productApi",
  tagTypes: ["Product"],
  baseQuery: baseQueryWithErrorHandling, //custom base query with error handling
  endpoints: (builder) => ({
    fetchProducts: builder.query<Product[], void>({
      query: () => ({ url: "/search", method: "GET" }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Product" as const, id })),
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
    createProduct: builder.mutation<Product, CreateAndUpdateProductInput>({
      query: (product) => {
        const formData = new FormData();
        formData.append("name", product.name);
        formData.append("description", product.description);
        formData.append("oldPrice", product.oldPrice.toString());
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
        product.productFilterTagValues.forEach(val => {
          formData.append('productFilterTagValues', val.toString());
        });

        // Attribute groups (array of objects)
        // formData.append(
        //   "attributeGroups",
        //   JSON.stringify(product.attributeGroups)
        // );
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
    updateProduct: builder.mutation<Product,{ props: CreateAndUpdateProductInput; id: string }>({
      query: ({ props, id }) => {
        const formData = new FormData();
        formData.append("name", props.name);
        formData.append("description", props.description);
        formData.append("oldPrice", props.oldPrice.toString());
        formData.append("discount", props.discount.toString());
        formData.append("categoryId", props.categoryId);
        formData.append("brandId", props.brandId);
        formData.append("quantityInStock", props.quantityInStock.toString());

        // Main image
        if (props.mainImageFile && typeof props.mainImageFile === "string") {
          formData.append("mainImageUrl", props.mainImageFile); // là URL
        } else {
          formData.append("mainImageFile", props.mainImageFile); // là File
        }

        // Detail images
        if (props.detailImageFiles && props.detailImageFiles.length > 0) {
          props.detailImageFiles.forEach((fileOrUrl) => {
            if (typeof fileOrUrl === "string") {
              formData.append("detailImageUrls", fileOrUrl);
            } else {
              formData.append("detailImageFiles", fileOrUrl);
            }
          });
        }

        // Filter tags (object)
        formData.append(
          "productFilterTagValuesJson",
          JSON.stringify(props.productFilterTagValues)
        );

        // Attribute groups (array of objects)
        formData.append(
          "attributeGroupsJson",
          JSON.stringify(props.attributeGroups)
        );

        return {
          url: `/products/manage/${id}`,
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
