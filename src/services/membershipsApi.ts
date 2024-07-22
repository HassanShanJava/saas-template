const API_BASE_URL = import.meta.env.VITE_API_URL;
import { createMembershipType, membeshipsTableType } from "@/app/types";
import { apiSlice } from "@/features/api/apiSlice";

export const Memberships = apiSlice.injectEndpoints({
  endpoints(builder) {
    return {
      getMemberships: builder.query<membeshipsTableType[], number>({
        query: (org_id) => ({
          url: `/membership_plan/membership_plans/getAll?org_id=${org_id}`,
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }),
        providesTags: ["Memberships"],
      }),
      createMemberships: builder.mutation<any, createMembershipType>({
        query: (membershipsydata) => ({
          url: `/membership_plan/membership_plans`,
          method: "POST",
          body: membershipsydata,
          headers: {
            Accept: "application/json",
          },
        }),
        invalidatesTags: ["Memberships"],
      }),
      updateMemberships: builder.mutation<any, any>({
        query: (membershipsydata) => ({
          url: `/membership_plan/membership_plans`,
          method: "PUT",
          body: membershipsydata,
          headers: {
            Accept: "application/json",
          },
        }),
        invalidatesTags: ["Memberships"],
      }),
      deleteMemberships: builder.mutation<any, any>({
        query: (membershipsydata) => ({
          url: `/membership_plan/membership_plans`,
          method: "DELETE",
          body: membershipsydata,
          headers: {
            Accept: "application/json",
          },
        }),
        invalidatesTags: ["Memberships"],
      }),
      getMembershipsById: builder.query<any, number>({
        query: (membership_id) => ({
          url: `/membership_plan/membership_plans?income_category_id=${membership_id}`,
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }),
        providesTags: ["Memberships"],
      }),
    };
  },
});

export const {
  useGetMembershipsQuery,
  useCreateMembershipsMutation,
  useUpdateMembershipsMutation,
  useDeleteMembershipsMutation,
  useGetMembershipsByIdQuery,
} = Memberships;
