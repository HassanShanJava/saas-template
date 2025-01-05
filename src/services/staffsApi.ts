import { ApiResponse } from "@/app/types/shared_types";
import { Staff, StaffTable } from "@/app/types/staff";
import { apiSlice } from "@/features/api/apiSlice";

export enum Status {
  Active = "active",
  Inactive = "inactive",
  Pending = "pending",
}
export const Staffs = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStaffById: builder.query<Staff, number>({
      query: (staff_id) => ({
        url: `/staff/${staff_id}`,
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }),
      providesTags: (result, error, arg) => [{ type: "Staffs", id: arg }],
    }),
    createStaff: builder.mutation<ApiResponse, Staff>({
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
    getStaffs: builder.query<StaffTable, { query: string }>({
      query: ({ query }) => ({
        url: `/staff${query ? "?" + query : ""}`,
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }),
      providesTags: ["Staffs"],
    }),
    getStaffList: builder.query<{ value: string; label: string }[], void>({
      query: () => ({
        url: `/staff`,
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }),
      providesTags: ["Staffs"],
      transformResponse: (resp: {
        data: {
          id: string;
          first_name: string;
          last_name: string;
          status: Status;
        }[];
      }) => {
        return resp.data
          .filter((staff) => staff.status !== Status.Inactive)
          .map(
            (staff: {
              id: string;
              first_name: string;
              last_name: string;
              status: Status;
            }) => ({
              value: staff.id,
              label: `${staff.first_name} ${staff.last_name}`,
            })
          );
      },
    }),
    updateStaff: builder.mutation<ApiResponse, Staff>({
      query: (staffdata) => ({
        url: `/staff/${staffdata.id}`,
        method: "PUT",
        body: staffdata,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Staffs"],
    }),
    deleteStaff: builder.mutation<ApiResponse, number>({
      query: (staffId) => ({
        url: `/staff/${staffId}`,
        method: "DELETE",
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
  useGetStaffsQuery,
  useGetStaffByIdQuery,
  useGetStaffListQuery,
  useCreateStaffMutation,
  useUpdateStaffMutation,
  useDeleteStaffMutation,
} = Staffs;
