import { apiSlice } from "@/features/api/apiSlice";
import { getRolesType } from "../app/types";

export const Roles = apiSlice.injectEndpoints({
  endpoints(builder) {
    return {
      getRoles: builder.query<getRolesType[], number>({
        query: (orgId) => ({
          url: `/role?org_id=${orgId}`,
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }),
      }),
    };
  },
});

export const { useGetRolesQuery } = Roles;
