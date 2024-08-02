import { createMembershipType, membeshipsTableType, updateMembershipType } from "@/app/types";
import { apiSlice } from "@/features/api/apiSlice";

export const Memberships = apiSlice.injectEndpoints({
  endpoints(builder) {
    return {
      getMemberships: builder.query<membeshipsTableType[], number>({
        query: (org_id) => ({
          url: `/membership_plan?org_id=${org_id}`,
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }),
        providesTags: ["Memberships"],
      }),
      createMemberships: builder.mutation<any, createMembershipType>({
        query: (membershipsdata) => ({
          url: `/membership_plan`,
          method: "POST",
          body: membershipsdata,
          headers: {
            Accept: "application/json",
          },
        }),
        invalidatesTags: ["Memberships"],
      }),
      updateMemberships: builder.mutation<any, updateMembershipType>({
        query: (membershipsdata) => ({
          url: `/membership_plan`,
          method: "PUT",
          body: membershipsdata,
          headers: {
            Accept: "application/json",
          },
        }),
        invalidatesTags: ["Memberships"],
      }),
      deleteMemberships: builder.mutation<any, number>({
        query: (membership_id) => ({
          url: `/membership_plan/${membership_id}`,
          method: "DELETE",
          headers: {
            Accept: "application/json",
          },
        }),
        invalidatesTags: ["Memberships"],
      }),
      getMembershipsById: builder.query<any, number>({
        query: (membership_id) => ({
          url: `/membership_plan/${membership_id}`,
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
