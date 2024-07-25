import { apiSlice } from "@/features/api/apiSlice";
import { getRolesType, resourceTypes } from "../app/types";

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
      getResources: builder.query<any, number | undefined>({
        query: (role_id) => ({
          url: `/role?role_id=${role_id}`,
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          providesTags: ["Roles"],
        }),
      }),
      getAllResources: builder.query<resourceTypes[], void>({
        query: () => ({
          url: `/role/resource`,
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          providesTags: ["Roles"],
        }),
        transformResponse: (resp: resourceTypes[]) => {
          const transformedArray:resourceTypes[] = [];
          const childrenMap:Record<string,Array<resourceTypes>>={};
          resp.forEach((item) => {
            if (item.is_parent) {
              item.children = [];
              transformedArray.push(item);
            } else if (item.parent) {
              childrenMap[item.parent!] = childrenMap[item.parent!] || [];
              childrenMap[item.parent!].push(item);
            } else {
              transformedArray.push(item);
            }
          });

          // Associate children with their respective parents
          transformedArray.forEach((parent) => {
            if (childrenMap[parent.code!]) {
              parent.children = childrenMap[parent.code!];
            }
          });

          return transformedArray;
        },
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
  useGetAllResourcesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
} = Roles;
