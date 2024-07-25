import { apiSlice } from "@/features/api/apiSlice";
import { createRoleTypes, getRolesType, resourceTypes, updateRoleTypes } from "../app/types";

interface TranformedResourceRsp{
  allResourceData:resourceTypes[];
  count:number;
}

export const Roles = apiSlice.injectEndpoints({
  endpoints(builder) {
    return {
      getRoles: builder.query<getRolesType[], number>({
        query: (org_id) => ({
          url: `/role?org_id=${org_id}`,
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
      getAllResources: builder.query<TranformedResourceRsp, void>({
        query: () => ({
          url: `/role/resource`,
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          providesTags: ["Roles"],
        }),
        transformResponse: (resp: resourceTypes[]) => {
          const count:number=resp.filter(item=>!item.is_parent).length
          const allResourceData:resourceTypes[] = [];
          const childrenMap:Record<string,Array<resourceTypes>>={};
          resp.forEach((item) => {
            if (item.is_parent) {
              item.children = [];
              allResourceData.push(item);
            } else if (item.parent) {
              childrenMap[item.parent!] = childrenMap[item.parent!] || [];
              childrenMap[item.parent!].push(item);
            } else {
              allResourceData.push(item);
            }
          });

          // Associate children with their respective parents
          allResourceData.forEach((parent) => {
            if (childrenMap[parent.code!]) {
              parent.children = childrenMap[parent.code!];
            }
          });

          return {allResourceData, count};
        },
      }),
      createRole: builder.mutation<any[], createRoleTypes>({
        query: (roledata) => ({
          url: `/role`,
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          body: roledata,
          providesTags: ["Roles"],
        }),
      }),
      updateRole: builder.mutation<any, updateRoleTypes>({
        query: (roledata) => ({
          url: `/role`,
          method: "PUT",
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
