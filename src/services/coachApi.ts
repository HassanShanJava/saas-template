import {
  addCoachResponseType,
  CoachInputTypes,
  CoachResponseTypeById,
  CoachTableDataTypes,
  CoachTypes,
  coachUpdateInput,
  ServerResponseById,
} from "@/app/types";

import { apiSlice } from "@/features/api/apiSlice";

interface coachInput {
  query: string;
  org_id: number;
}

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
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }),
        providesTags: ["Coaches"],
      }),
      getCoaches: builder.query<CoachTypes, coachInput>({
        query: (searchCretiria) => ({
          url: `/coach?org_id=${searchCretiria.org_id}&${searchCretiria.query}`,
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }),
        providesTags: ["Coaches"],
      }),
      deleteCoach: builder.mutation<
        addCoachResponseType,
        { org_id: number; id: number }
      >({
        query: (coach) => ({
          url: `/coach/${coach.id}?org_id=${coach.org_id}`,
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }),
        invalidatesTags: ["Coaches"],
      }),
      updateCoach: builder.mutation<any, CoachInputTypes & { id: number }>({
        query: (coachdata) => ({
          url: `/coach/${coachdata.id}`,
          method: "PUT",
          body: coachdata,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }),
        invalidatesTags: ["Coaches"],
      }),
      getCoachById: builder.query<
        CoachResponseTypeById,
        { org_id: number; id: number }
      >({
        query: (coach) => ({
          url: `/coach/${coach.id}?org_id=${coach.org_id}`,
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }),
        providesTags: ["Coaches"],

        // transformResponse: (response: ServerResponseById) => {
        //   const { members, ...rest } = response;
        //   return {
        //     ...rest,
        //     member_ids: members.map((member)=>member.id),
        //   };
        // },
        // providesTags: (result, error, arg) => [{ type: "Coaches", id: arg }],
      }),
      getCoachList: builder.query<{ value: number; label: string }[], number>({
        query: (org_id) => ({
          url: `/coach/list/${org_id}`,
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }),
        transformResponse: (response: { id: number; name: string }[]) => {
          console.log("Original Response:", response);
          return response.map((item) => ({
            value: item.id,
            label: item.name,
          }));
        },
        providesTags: ["Coaches"],
      }),
      getCoachAutoFill: builder.query<
        CoachTableDataTypes,
        { org_id: number; email: string }
      >({
        query: (coach) => ({
          url: `/coach/${coach.email}?org_id=${coach.org_id}`,
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
  useGetCoachesQuery,
  useDeleteCoachMutation,
  useUpdateCoachMutation,
  useGetCoachByIdQuery,
  useGetCoachListQuery,
  useGetCoachAutoFillQuery,
} = Roles;
