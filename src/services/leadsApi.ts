import {
  staffType,
  leadType,
  LeadInputTypes,
  LeadResponseTypes,
  updateStatusInput,
  updateStaffInput,
  updateLeadInput,
} from "../app/types";
import { apiSlice } from "@/features/api/apiSlice";

export const Leads = apiSlice.injectEndpoints({
  endpoints(builder) {
    return {
      AddLead: builder.mutation<LeadResponseTypes, LeadInputTypes>({
        query: (leaddata) => ({
          url: "/leads ",
          method: "POST",
          body: leaddata,
          headers: {
            Accept: "application/json",
          },
        }),
      }),
      getAllStaff: builder.query<staffType[], number>({
        query: (org_id) => ({
          url: `/leads?org_id=${org_id}`,
          headers: {
            Accept: "application/json",
          },
        }),
      }),
      getLeads: builder.query<leadType[], number>({
        query: (org_id) => ({
          url: `/leads?org_id=${org_id}`,
          headers: {
            Accept: "application/json",
          },
        }),
      }),
      updateStatus: builder.mutation<any, updateStatusInput>({
        query: (clientdata) => ({
          url: "/leads/status",
          method: "PUT",
          body: clientdata,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }),
      }),
      updateleadStaff: builder.mutation<any, updateStaffInput>({
        query: (clientdata) => ({
          url: "/leads/staff",
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
          url: "/leads",
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
  useUpdateleadStaffMutation,
} = Leads;
