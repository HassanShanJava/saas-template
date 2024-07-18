import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import {
  CountryTypes,
  BusinessTypes,
  CoachTypes,
  sourceTypes,
  membershipplanTypes,
  ClientInputTypes,
  ClientResponseTypes,
  clientTablestypes,
} from "../app/types";
import { RootState } from "@/app/store";
import { logout, tokenReceived } from "@/features/auth/authSlice";
const API_BASE_URL = import.meta.env.VITE_API_URL;

const baseQuery = fetchBaseQuery({
	baseUrl: API_BASE_URL,
	prepareHeaders: (headers, { getState }) => {
		const token = (getState() as RootState).auth.userToken;
		if (token) headers.set("Authorization", `Bearer ${token}`);
		return headers;
	},
})

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

export const ClientAPi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  endpoints(builder) {
    return {
      getClientCount: builder.query<{ total_clients: number }, number>({
        query: (org_id) => ({
          url: `/client/getTotalClient/${org_id}`,
          headers: {
            Accept: "application/json",
          },
        }),
      }),
      getCountries: builder.query<CountryTypes[], void>({
        query: () => ({
          url: "/get_all_countries/",
          headers: {
            Accept: "application/json",
          },
        }),
      }),
      getCoaches: builder.query<CoachTypes[], number>({
        query: (org_id) => ({
          url: `/coach/getCoach/${org_id}`,
          headers: {
            Accept: "application/json",
          },
        }),
      }),
      getAllSource: builder.query<sourceTypes[], void>({
        query: () => ({
          url: "/get_all_sources/",
          headers: {
            Accept: "application/json",
          },
        }),
      }),
      getAllBusinesses: builder.query<BusinessTypes[], number>({
        query: (org_id) => ({
          url: `/client/business/${org_id}`,
          headers: {
            Accept: "application/json",
          },
        }),
      }),
      getAllMemberships: builder.query<membershipplanTypes[], number>({
        query: (org_id) => ({
          url: `/membership_plan/get_all/${org_id}`,
          headers: {
            Accept: "application/json",
          },
        }),
      }),
      getAllClient: builder.query<clientTablestypes[], number>({
        query: (org_id) => ({
          url: `/client/filter/?org_id=${org_id}`,
          headers: {
            Accept: "application/json",
          },
        }),
      }),
      AddClient: builder.mutation<ClientResponseTypes, ClientInputTypes>({
        query: (clientdata) => ({
          url: "/client/register",
          method: "POST",
          body: clientdata,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }),
      }),
    };
  },
});

export const {
  useGetClientCountQuery,
  useGetCountriesQuery,
  useGetCoachesQuery,
  useGetAllSourceQuery,
  useGetAllBusinessesQuery,
  useGetAllMembershipsQuery,
  useGetAllClientQuery,
  useAddClientMutation,
} = ClientAPi;
