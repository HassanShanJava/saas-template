import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { RootState } from "@/app/store";
import {
  deleteSaleTaxesType,
  saleTaxesInputType,
  saleTaxesResponseType,
  updateSaleTaxesType,
} from "@/app/types";
import { logout, tokenReceived } from "@/features/auth/authSlice";
const API_BASE_URL = import.meta.env.VITE_API_URL;

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
		const refresh_token = (api.getState() as RootState).auth.userToken;
    const refreshResult = await baseQuery({
			url:`/refresh_token?refresh_token=${refresh_token}`, 
			method: "POST",
		}, api, extraOptions);

    if (refreshResult.data) {
      api.dispatch(tokenReceived((refreshResult.data as {access_token: string;}).access_token));
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }
  return result;
};

const baseQuery = fetchBaseQuery({
	baseUrl: API_BASE_URL,
	prepareHeaders: (headers, { getState }) => {
		const token = (getState() as RootState).auth.userToken;
		if (token) headers.set("Authorization", `Bearer ${token}`);
		headers.set("Access-Control-Allow-Origin", `*`);
		return headers;
	},
})

export const SalesTax = createApi({
  reducerPath: "api/salesTax",
  baseQuery: baseQueryWithReauth,
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
