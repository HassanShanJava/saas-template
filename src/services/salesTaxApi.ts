import {
  deleteSaleTaxesType,
  saleTaxesInputType,
  saleTaxesResponseType,
  updateSaleTaxesType,
} from "@/app/types";
import { apiSlice } from "@/features/api/apiSlice";

export const SalesTax = apiSlice.injectEndpoints({
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
