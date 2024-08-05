import {
  StaffInputType,
  StaffResponseType,
  staffTypesResponseList,
} from "@/app/types";
import { apiSlice } from "@/features/api/apiSlice";


interface staffInput{
	query:string,
	org_id:number
}

export const StaffApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStaffCount: builder.query<{ total_staffs: number }, number>({
      query: (org_id) => ({
        url: `/staff/count/${org_id}`,
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }),
      providesTags: ["Staffs"],
    }),
    //get the satff by Id
    getStaffById: builder.query<StaffResponseType, number>({
      query: (staff_id) => ({
        url: `/staff/${staff_id}`,
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }),
      providesTags: (result, error, arg) => [{ type: "Staffs", id: arg }],
    }),
    // Adding the Staff
    AddStaff: builder.mutation<StaffResponseType, StaffInputType>({
      query: (staffdata) => ({
        url: "/staff",
        method: "POST",
        body: staffdata,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Staffs"],
    }),
    GetStaffList: builder.query<staffTypesResponseList[], staffInput>({
      query: (searchCretiria) => ({
        url: `/staff?org_id=${searchCretiria.org_id}&${searchCretiria.query}`,
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }),
      providesTags: ["Staffs"],
    }),
    deleteStaff: builder.mutation<any, number>({
      query: (staffId) => ({
        url: `/staff/${staffId}`,
        method: "DELETE",
        body: staffId,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Staffs"],
    }),
    updateStaff: builder.mutation<staffTypesResponseList, StaffInputType>({
      query: (staffdata) => ({
        url: "/staff",
        method: "PUT",
        body: staffdata,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Staffs"],
    }),
  }),
});

export const {
  useGetStaffCountQuery,
  useGetStaffByIdQuery,
  useAddStaffMutation,
  useGetStaffListQuery,
  useDeleteStaffMutation,
  useUpdateStaffMutation,
} = StaffApi;
