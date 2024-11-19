import { RootState } from "@/app/store";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { logout, tokenReceived } from "../auth/authSlice";
import { setCode, setCounter } from "../counter/counterSlice";

const API_BASE_URL = import.meta.env.VITE_API_URL;
interface FastApiError {
  detail?: string | string[]; // FastAPI's detail field can be a string or an array of strings
  message?  : string | string[]; // FastAPI's detail field can be a string or an array of strings
}
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
        body: { token: refresh_token },
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
      },
      api,
      extraOptions
    );

    // save to redux else logout
    if (refreshResult.data) {
      const newAccessToken = (refreshResult.data as { access_token: string })
        .access_token;
      api.dispatch(tokenReceived(newAccessToken));
      localStorage.setItem("userToken", newAccessToken);
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(setCode(null));
      api.dispatch(setCounter(null));
      api.dispatch(logout());
    }
  }

   if (result.error) {
     const { status, data } = result.error as FetchBaseQueryError & {
       data?: FastApiError;
     };

     // Check for a 422 Unprocessable Entity or other specific errors
     if (status === 422 && data && typeof data === "object") {
       const errorDetail = Array.isArray(data.detail)
         ? data.detail.join(", ")
         : data.detail || "Unprocessable entity";
       result.error.data = { message: errorDetail };
     } else {
       // For other errors, keep the default behavior
       result.error.data = {
         message:
           (data as FastApiError)?.detail || "An unexpected error occurred",
       };
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
    headers.set("Accept", "application/json");
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
    "Members",
    "Reset",
    "Workout",
    "Counter",
    "Register",
    "Transaction",
    "Organization",
    "Hardware",
    "PaymentMethods",
    "User",
    "Invoice"
  ],
});
