import {
  addCoachResponseType,
  CoachInputTypes,
  CoachResponseTypeById,
  coachUpdateInput,
  ServerResponseById,
} from "@/app/types";

import { apiSlice } from "@/features/api/apiSlice";

export const Roles = apiSlice.injectEndpoints({
  endpoints(builder) {
    return {
      AddCoach: builder.mutation<addCoachResponseType, CoachInputTypes>({
        query: (coachdata) => ({
          url: "/coach",
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
          url: `/coach/count/${org_id}`,
          headers: {
            Accept: "application/json",
          },
        }),
      }),
      getMemberList: builder.query<{ id: number; name: string }[], number>({
        query: (org_id) => ({
          url: `/member/list/${org_id}`,
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
      getListOfCoach: builder.query<any[], number>({
        query: (org_id) => ({
          url: `/coach?org_id=${org_id}`,
          headers: {
            Accept: "application/json",
          },
        }),
        providesTags: ["Coaches"],
      }),
      deleteCoach: builder.mutation<addCoachResponseType, number>({
        query: (coachId) => ({
          url: `/coach/${coachId}`,
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }),
        invalidatesTags: ["Coaches"],
      }),
      updateCoach: builder.mutation<any, any>({
        query: (coachdata) => ({
          url: "/coach",
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
          url: `/coach/${coach_id}`,
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
