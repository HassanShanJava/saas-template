import {
  StaffInputType,
  StaffResponseType,
  staffTypesResponseList,
} from "@/app/types";
import { apiSlice } from "@/features/api/apiSlice";

export const StaffApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStaffCount: builder.query<{ total_staffs: number }, number>({
      query: (org_id) => ({
        url: `/staff/staffs/getTotalStaff?org_id=${org_id}`,
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }),
    }),
    //get the satff by Id
    getStaffById: builder.query<StaffResponseType, number>({
      query: (staff_id) => ({
        url: `/staff/staffs?staff_id=${staff_id}`,
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }),
    }),
    // Adding the Staff
    AddStaff: builder.mutation<StaffResponseType, StaffInputType>({
      query: (staffdata) => ({
        url: "/staff/staffs",
        method: "POST",
        body: staffdata,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }),
    }),
    GetStaffList: builder.query<staffTypesResponseList[], number>({
      query: (org_id) => ({
        url: `/staff/staffs/getAll?org_id=${org_id}`,
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }),
    }),
  }),
});

export const {
  useGetStaffCountQuery,
  useGetStaffByIdQuery,
  useAddStaffMutation,
  useGetStaffListQuery,
} = StaffApi;
