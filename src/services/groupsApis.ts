const API_BASE_URL = import.meta.env.VITE_API_URL;
import { groupCreateType, groupRespType } from "@/app/types";
import { apiSlice } from "@/features/api/apiSlice";

interface TransformedGroup {
  value: number;
  label: string;
}


export const Groups = apiSlice.injectEndpoints({
  endpoints(builder) {
    return {
      getGroups: builder.query<TransformedGroup[], number>({
        query: (org_id) => ({
          url: `/membership_plan/group/getAll?org_id=${org_id}`,
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }),
        transformResponse: (resp: groupRespType[]) => {
          return resp.map((item) => ({
            value: item.id,
            label: item.name
          }));
        },
        providesTags: ["Groups"],
      }),
      createGroups: builder.mutation<groupRespType, groupCreateType>({
        query: (membershipsydata) => ({
          url: `/membership_plan/group`,
          method: "POST",
          body: membershipsydata,
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
  useGetGroupsQuery,
  useCreateGroupsMutation,
} = Groups;
