import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import {
  createCreditsType,
  creditsResponseType,
  deleteCreditsType,
  updateCreditsType,
} from "../app/types";
import { RootState } from "@/app/store";
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
			console.log(refreshResult.data);
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

export const Credits = createApi({
  reducerPath: "api/credits",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Credits"],
  endpoints(builder) {
    return {
      getCredits: builder.query<creditsResponseType[], number>({
        query: (org_id) => ({
          url: `/membership_plan/credits/getAll?org_id=${org_id}`,
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }),
        providesTags: ["Credits"],
      }),
      createCredits: builder.mutation<any, createCreditsType>({
        query: (creditsdata) => ({
          url: `/membership_plan/credits`,
          method: "POST",
          body: creditsdata,
          headers: {
            Accept: "application/json",
          },
        }),
        invalidatesTags: ["Credits"],
      }),
      updateCredits: builder.mutation<any, updateCreditsType>({
        query: (creditsdata) => ({
          url: `/membership_plan/credits`,
          method: "PUT",
          body: creditsdata,
          headers: {
            Accept: "application/json",
          },
        }),
        invalidatesTags: ["Credits"],
      }),
      deleteCredits: builder.mutation<any, any>({
        query: (creditsdata) => ({
          url: `/membership_plan/credits`,
          method: "DELETE",
          body: creditsdata,
          headers: {
            Accept: "application/json",
          },
        }),
        invalidatesTags: ["Credits"],
      }),
      getCreditsById: builder.query<any, number>({
        query: (org_id) => ({
          url: `/membership_plan/credits?credit_id=${org_id}`,
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }),
        providesTags: ["Credits"],
      }),
    };
  },
});

export const {
  useGetCreditsQuery,
  useCreateCreditsMutation,
  useUpdateCreditsMutation,
  useDeleteCreditsMutation,
  useGetCreditsByIdQuery,
} = Credits;
