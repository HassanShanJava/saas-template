import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { staffType,LeadInputTypes,LeadResponseTypes } from "../app/types";
const API_BASE_URL = import.meta.env.VITE_API_URL;

export const Leads = createApi({
  reducerPath: "api/leads",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  endpoints(builder) {
    return {
      AddLead: builder.mutation<LeadResponseTypes, LeadInputTypes>({
        query: (leaddata) => ({
          url: "/leads/register/lead",
          method: "POST",
          body: leaddata,
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
    };
  }
});

export const {
 useGetAllStaffQuery,
 useAddLeadMutation
} = Leads;
