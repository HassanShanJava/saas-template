import { groupCreateType, groupRespType } from "@/app/types";
import { apiSlice } from "@/features/api/apiSlice";

interface TransformedGroup {
  value: number;
  label: string;
  id?: number
}

export const Groups = apiSlice.injectEndpoints({
  endpoints(builder) {
    return {
      getGroup: builder.query<TransformedGroup[], number>({
        query: (org_id) => ({
          url: `/group?org_id=${org_id}`,
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }),
        transformResponse: (resp: groupRespType[]) => {
          return resp.map((item) => ({
            value: item.id,
            label: item.name,
            id: item.id
          }));
        },
        providesTags: ["Groups"],
      }),
      createGroup: builder.mutation<groupRespType, groupCreateType>({
        query: (membershipsydata) => ({
          url: `/group`,
          method: "POST",
          body: membershipsydata,
          headers: {
            Accept: "application/json",
          },
        }),
        invalidatesTags: ["Groups"],
      }),
      updateGroup: builder.mutation<groupRespType, groupCreateType>({
        query: (groupdata) => ({
          url: `/group`,
          method: "POST",
          body: groupdata,
          headers: {
            Accept: "application/json",
          },
        }),
        invalidatesTags: ["Groups"],
      }),
      deleteGroup: builder.mutation<any, number>({
        query: (group_id) => ({
          url: `/group/${group_id}`,
          method: "POST",
          headers: {
            Accept: "application/json",
          },
        }),
        invalidatesTags: ["Groups"],
      }),
      getGroupById: builder.mutation<groupRespType, number>({
        query: (group_id) => ({
          url: `/group/${group_id}`,
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }),
        invalidatesTags: ["Groups"],
      })
    };
  },
});

export const {
  useGetGroupQuery,
  useCreateGroupMutation,
  useUpdateGroupMutation,
  useDeleteGroupMutation,
  useGetGroupByIdMutation
} = Groups;
