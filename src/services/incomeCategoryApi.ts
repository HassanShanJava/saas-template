import { createIncomeCategoryType, deleteIncomeCategoryType, incomeCategoryResponseType, incomeCategoryTableResponseType, updateIncomeCategoryType } from "@/app/types";
import { apiSlice } from "@/features/api/apiSlice";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface incomeCategoryInput{
	query:string,
	org_id:number
}

export const IncomeCategory = apiSlice.injectEndpoints({
  endpoints(builder) {
    return {
      getIncomeCategory: builder.query<incomeCategoryTableResponseType, incomeCategoryInput>({
        query: (searchCretiria) => ({
          url: `/income_category?org_id=${searchCretiria.org_id}&${searchCretiria.query}`,
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }),
        providesTags: ["IncomeCategory"],
      }),
      createIncomeCategory: builder.mutation<any, createIncomeCategoryType>({
        query: (incomeCategorydata) => ({
          url: `/income_category`,
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
          url: `/income_category`,
          method: "PUT",
          body: incomeCategorydata,
          headers: {
            Accept: "application/json",
          },
        }),
        invalidatesTags: ["IncomeCategory"],
      }),
      deleteIncomeCategory: builder.mutation<any, number>({
        query: (income_category_id) => ({
          url: `/income_category/${income_category_id}`,
          method: "DELETE",
          headers: {
            Accept: "application/json",
          },
        }),
        invalidatesTags: ["IncomeCategory"],
      }),
      getIncomeCategoryById: builder.query<incomeCategoryResponseType, number>({
        query: (income_category_id) => ({
          url: `/income_category/${income_category_id}`,
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }),
        providesTags: ["IncomeCategory"],
      }),
      getIncomeCategorList: builder.query<any[], number>({
        query: (org_id) => ({
          url: `/income_category/list/${org_id}`,
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
  useGetIncomeCategorListQuery,
} = IncomeCategory;
