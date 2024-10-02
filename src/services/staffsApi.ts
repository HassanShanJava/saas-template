import {
  StaffInputType,
  StaffResponseType,
  staffTableTypes,
  staffTypesResponseList,
} from "@/app/types";
import { apiSlice } from "@/features/api/apiSlice";


interface staffInput {
  query: string,
  org_id: number
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
    getStaffs: builder.query<staffTableTypes, staffInput>({
      query: (searchCretiria) => ({
        url: `/staff?org_id=${searchCretiria.org_id}&${searchCretiria.query}`,
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }),
      providesTags: ["Staffs"],
    }),
    getStaffList: builder.query<{ value: number, label: string }[], number>({
      query: (org_id) => ({
        url: `/staff/list?org_id=${org_id}`,
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }),
      providesTags: ["Staffs"],
      transformResponse: (resp: { id: number, name: string }[]) => {
        return resp?.map((staff: { id: number, name: string }) => ({ value: staff.id, label: staff.name }))
      }
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
  useGetStaffListQuery,
  useGetStaffByIdQuery,
  useAddStaffMutation,
  useGetStaffsQuery,
  useDeleteStaffMutation,
  useUpdateStaffMutation,
} = StaffApi;
