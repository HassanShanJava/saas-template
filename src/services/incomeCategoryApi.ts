import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const token = localStorage.getItem("userToken");

export const IncomeCategory = createApi({
  reducerPath: "api/incomeCategory",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["IncomeCategory"],
  endpoints(builder) {
    return {
      getIncomeCategory: builder.query<any, number>({
        query: (org_id) => ({
          url: `/membership_plan/income_category/getAll?org_id=${org_id}`,
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }),
        providesTags: ["IncomeCategory"],
      }),
      createIncomeCategory: builder.mutation<any, any>({
        query: (incomeCategorydata) => ({
          url: `/membership_plan/income_category`,
          method: "POST",
          body: incomeCategorydata,
          headers: {
            Accept: "application/json",
          },
        }),
        invalidatesTags: ["IncomeCategory"],
      }),
      updateIncomeCategory: builder.mutation<any, any>({
        query: (incomeCategorydata) => ({
          url: `/membership_plan/income_category`,
          method: "PUT",
          body: incomeCategorydata,
          headers: {
            Accept: "application/json",
          },
        }),
        invalidatesTags: ["IncomeCategory"],
      }),
      deleteIncomeCategory: builder.mutation<any, any>({
        query: (incomeCategorydata) => ({
          url: `/membership_plan/income_category`,
          method: "DELETE",
          body: incomeCategorydata,
          headers: {
            Accept: "application/json",
          },
        }),
        invalidatesTags: ["IncomeCategory"],
      }),
      getIncomeCategoryById: builder.query<any, number>({
        query: (income_category_id) => ({
          url: `/membership_plan/income_category?income_category_id=${income_category_id}`,
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }),
        providesTags: ["IncomeCategory"],
      }),
    };
  },
});

export const {
  useGetIncomeCategoryQuery,
  useCreateIncomeCategoryMutation,
  useUpdateIncomeCategoryMutation,
  useDeleteIncomeCategoryMutation,
  useGetIncomeCategoryByIdQuery,
} = IncomeCategory;
