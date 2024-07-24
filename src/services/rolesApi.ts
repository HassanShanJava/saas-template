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
          providesTags: ["Roles"],
        }),
      }),
      getResources: builder.query<getRolesType[], number>({
        query: (role_id) => ({
          url: `/role?role_id=${role_id}`,
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          providesTags: ["Roles"],
        }),
      }),
      createRole: builder.mutation<any[], any>({
        query: (roledata) => ({
          url: `/role`,
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          body: roledata,
          providesTags: ["Roles"],
        }),
      }),
      updateRole: builder.mutation<any, any>({
        query: (roledata) => ({
          url: `/role`,
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          body: roledata,
          providesTags: ["Roles"],
        }),
      }),
    };
  },
});

export const {
  useGetRolesQuery,
  useGetResourcesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
} = Roles;
