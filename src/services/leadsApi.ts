import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  staffType,
  leadType,
  LeadInputTypes,
  LeadResponseTypes,
  updateStatusInput,
  updateStaffInput,
} from "../app/types";

import { RootState } from "@/app/store";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const Leads = createApi({
  reducerPath: "api/leads",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL, 
   prepareHeaders:(headers,{getState})=>{
      const token=(getState() as RootState).auth.userToken;
      if(token) headers.set("Authorization",`Bearer ${token}`)
      return headers;
      }, 
  }),
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
