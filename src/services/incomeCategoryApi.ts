import { createIncomeCategoryType, deleteIncomeCategoryType, incomeCategoryResponseType, updateIncomeCategoryType } from "@/app/types";
import { apiSlice } from "@/features/api/apiSlice";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const IncomeCategory = apiSlice.injectEndpoints({
  endpoints(builder) {
    return {
      getIncomeCategory: builder.query<incomeCategoryResponseType[], number>({
        query: (org_id) => ({
          url: `/membership_plan/income_category/getAll?org_id=${org_id}`,
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }),
        providesTags: ["IncomeCategory"],
      }),
      createIncomeCategory: builder.mutation<any, createIncomeCategoryType>({
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
      updateIncomeCategory: builder.mutation<any, updateIncomeCategoryType>({
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
      deleteIncomeCategory: builder.mutation<any, deleteIncomeCategoryType>({
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
      getIncomeCategoryById: builder.query<incomeCategoryResponseType, number>({
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
