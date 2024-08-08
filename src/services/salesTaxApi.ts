import {
  deleteSaleTaxesType,
  saleTaxesInputType,
  saleTaxesResponseType,
  saleTaxTableType,
  updateSaleTaxesType,
} from "@/app/types";
import { apiSlice } from "@/features/api/apiSlice";

interface saleTaxInput{
	query:string,
	org_id:number
}

export const SalesTax = apiSlice.injectEndpoints({
  endpoints(builder) {
    return {
      getSalesTax: builder.query<saleTaxTableType, saleTaxInput>({
        query: (searchCretiria) => ({
          url: `/sale_taxes?org_id=${searchCretiria.org_id}&${searchCretiria.query}`,
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
          url: `/sale_taxes`,
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
          url: `/sale_taxes`,
          method: "PUT",
          body: saleTaxesdata,
          headers: {
            Accept: "application/json",
          },
        }),
        invalidatesTags: ["SalesTax"],
      }),
      deleteSalesTax: builder.mutation<any, number>({
        query: (sale_tax_id) => ({
          url: `/sale_taxes/${sale_tax_id}`,
          method: "DELETE",
          headers: {
            Accept: "application/json",
          },
        }),
        invalidatesTags: ["SalesTax"],
      }),
      getSalesTaxById: builder.query<saleTaxesResponseType, number>({
        query: (sale_tax_id) => ({
          url: `/sale_taxes/${sale_tax_id}`,
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }),
        providesTags: ["SalesTax"],
      }),
      getSalesTaxList: builder.query<any[], number>({
        query: (org_id) => ({
          url: `/sales_tax/list/${org_id}`,
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
  useGetSalesTaxListQuery,
} = SalesTax;
