import {
  CoachInputTypes,
  CoachResponseTypeById,
  ServerResponseById,
} from "@/app/types";
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
        invalidatesTags: ["Coaches"],
      }),
      getCoachCount: builder.query<{ total_coaches: number }, number>({
        query: (org_id) => ({
          url: `/coach/getTotalCoach?org_id=${org_id}`,
          headers: {
            Accept: "application/json",
          },
        }),
      }),
      getMemberList: builder.query<{ id: number; name: string }[], number>({
        query: (org_id) => ({
          url: `/member/list?org_id=${org_id}`,
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
        providesTags: ["Coaches"],
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
        invalidatesTags: ["Coaches"],
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
        invalidatesTags: ["Coaches"],
      }),
      getCoachById: builder.query<CoachResponseTypeById, number>({
        query: (coach_id) => ({
          url: `/coach/coaches?coach_id=${coach_id}`,
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }),
        transformResponse: (response: ServerResponseById) => {
          const { members, ...rest } = response;
          return {
            ...rest,
            member_ids: members,
          };
        },
        providesTags: (result, error, arg) => [{ type: "Coaches", id: arg }],
        // providesTags: ["Coaches"],
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
