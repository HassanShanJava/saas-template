import { CoachInputTypes } from "@/app/types";
import { apiSlice } from "@/features/api/apiSlice";

export const Roles = apiSlice.injectEndpoints({
  endpoints(builder) {
    return {
      AddCoach: builder.mutation<any, CoachInputTypes>({
        query: (coachdata) => ({
          url: "/coach/coaches",
          method: "POST",
          body: coachdata,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }),
        invalidatesTags: ["Coaches"], // Invalidate the cache for coaches
      }),
      getCoachCount: builder.query<{ total_coaches: number }, number>({
        query: (org_id) => ({
          url: `/coach/getTotalCoach?org_id=${org_id}`,
          headers: {
            Accept: "application/json",
          },
        }),
        providesTags: ["Coaches"], // Provide cache for coaches
      }),
      getMemberList: builder.query<{ id: number; name: string }[], number>({
        query: (org_id) => ({
          url: `/client/list?org_id=${org_id}`,
          headers: {
            Accept: "application/json",
          },
        }),
        transformResponse: (
          resp: { id: number; first_name: string; last_name: string }[]
        ) =>
          resp.map((member) => ({
            id: member.id,
            name: `${member.first_name} ${member.last_name}`,
          })),
      }),
      getListOfCoach: builder.query<any, number>({
        query: (org_id) => ({
          url: `/coach/coaches/getAll?org_id=${org_id}`,
          headers: {
            Accept: "application/json",
          },
        }),
        providesTags: ["Coaches"], // Provide cache for coaches
      }),
      deleteCoach: builder.mutation<any, any>({
        query: (coachId) => ({
          url: "/coach/coaches",
          method: "DELETE",
          body: coachId,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }),
        invalidatesTags: ["Coaches"], // Invalidate the cache for coaches
      }),
      updateCoach: builder.mutation<any, any>({
        query: (coachdata) => ({
          url: "/coach/coaches",
          method: "PUT",
          body: coachdata,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }),
        invalidatesTags: ["Coaches"], // Invalidate the cache for coaches
      }),
      getCoachById: builder.query<any, any>({
        query: (coach_id) => ({
          url: `/coach/coaches?coach_id=${coach_id}`,
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }),
        providesTags: ["Coaches"],
      }),
    };
  },
});

export const {
  useAddCoachMutation,
  useGetCoachCountQuery,
  useGetMemberListQuery,
  useGetListOfCoachQuery,
  useDeleteCoachMutation,
  useUpdateCoachMutation,
  useGetCoachByIdQuery,
} = Roles;
