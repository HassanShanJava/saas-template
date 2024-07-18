import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import {
  staffType,
  leadType,
  LeadInputTypes,
  LeadResponseTypes,
  updateStatusInput,
  updateStaffInput,
  updateLeadInput
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

export const Leads = createApi({
  reducerPath: "api/leads",
  baseQuery: baseQueryWithReauth,
	endpoints(builder) {
    return {
      AddLead: builder.mutation<LeadResponseTypes, LeadInputTypes>({
        query: (leaddata) => ({
          url: "/leads/register",
          method: "POST",
          body: leaddata,
          headers: {
            Accept: "application/json",
          },
        }),
      }),
      getAllStaff: builder.query<staffType[], number>({
        query: (org_id) => ({
          url: `/get_staff?org_id=${org_id}`,
          headers: {
            Accept: "application/json",
          },
        }),
      }),
      getLeads: builder.query<leadType[], number>({
        query: (org_id) => ({
          url: `/leads/getleads?org_id=${org_id}`,
          headers: {
            Accept: "application/json",
          },
        }),
      }),
      updateStatus: builder.mutation<any, updateStatusInput>({
        query: (clientdata) => ({
          url: "/leads/updateStatus",
          method: "PUT",
          body: clientdata,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }),
      }),
      updateStaff: builder.mutation<any, updateStaffInput>({
        query: (clientdata) => ({
          url: "/leads/updateStaff",
          method: "PUT",
          body: clientdata,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }),
      }),
      updateLead: builder.mutation<any, updateLeadInput>({
        query: (clientdata) => ({
          url: "/leads/update",
          method: "PUT",
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
  useGetAllStaffQuery,
  useAddLeadMutation,
  useGetLeadsQuery,
  useUpdateStatusMutation,
  useUpdateStaffMutation,
} = Leads;
