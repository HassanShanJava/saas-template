import { RootState } from "@/app/store";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { logout, tokenReceived } from "../auth/authSlice";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // refresh token
  if (result.error && result.error.status === 401) {
    const refresh_token = (api.getState() as RootState).auth.userToken;
    const refreshResult = await baseQuery(
      {
        url: `/refresh_token`,
        body: { refresh_token: refresh_token },
        method: "POST",
      },
      api,
      extraOptions
    );

    // save to redux else logout
    if (refreshResult.data) {
      api.dispatch(
        tokenReceived(
          (refreshResult.data as { access_token: string }).access_token
        )
      );
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
});

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
  tagTypes: [
    "Credits",
    "SalesTax",
    "IncomeCategory",
    "Memberships",
    "Groups",
    "Roles",
    "Coaches",
    "Staffs",
    "Exercise",
    "Foods",
    "MealPlans",
		'Members',
    'Reset'
  ],
});
