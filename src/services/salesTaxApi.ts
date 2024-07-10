import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "@/app/store";
import {
  deleteSaleTaxesType,
  saleTaxesInputType,
  saleTaxesResponseType,
  updateSaleTaxesType,
} from "@/app/types";
const API_BASE_URL = import.meta.env.VITE_API_URL;

export const SalesTax = createApi({
  reducerPath: "api/salesTax",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.userToken;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      headers.set("Access-Control-Allow-Origin", `*`);
      return headers;
    },
  }),
  tagTypes: ["SalesTax"],
  endpoints(builder) {
    return {
      getSalesTax: builder.query<saleTaxesResponseType[], number>({
        query: (org_id) => ({
          url: `/membership_plan/sale_taxes/getAll?org_id=${org_id}`,
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }),
        providesTags: ["SalesTax"],
        // transformResponse:(res:any[])=>res.sort((a,b)=>b.id-a.id)   //to sort in desc
      }),
      createSalesTax: builder.mutation<any, saleTaxesInputType>({
        query: (saleTaxesdata) => ({
          url: `/membership_plan/sale_taxes`,
          method: "POST",
          body: saleTaxesdata,
          headers: {
            Accept: "application/json",
          },
        }),
        invalidatesTags: ["SalesTax"],
      }),
      updateSalesTax: builder.mutation<any, updateSaleTaxesType>({
        query: (saleTaxesdata) => ({
          url: `/membership_plan/sale_taxes`,
          method: "PUT",
          body: saleTaxesdata,
          headers: {
            Accept: "application/json",
          },
        }),
        invalidatesTags: ["SalesTax"],
      }),
      deleteSalesTax: builder.mutation<any, deleteSaleTaxesType>({
        query: (saleTaxesdata) => ({
          url: `/membership_plan/sale_taxes`,
          method: "DELETE",
          body: saleTaxesdata,
          headers: {
            Accept: "application/json",
          },
        }),
        invalidatesTags: ["SalesTax"],
      }),
      getSalesTaxById: builder.query<saleTaxesResponseType, number>({
        query: (sale_tax_id) => ({
          url: `/membership_plan/sale_taxes?sale_tax_id=${sale_tax_id}`,
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }),
        providesTags: ["SalesTax"],
      }),
    };
  },
});

export const {
  useGetSalesTaxQuery,
  useCreateSalesTaxMutation,
  useUpdateSalesTaxMutation,
  useDeleteSalesTaxMutation,
  useGetSalesTaxByIdQuery,
} = SalesTax;
