import { apiSlice } from "@/features/api/apiSlice";
import {
  createRoleTypes,
  getRolesType,
  resourceTypes,
  updateRoleTypes,
} from "../app/types";

interface TranformedResourceRsp {
  allResourceData: resourceTypes[];
  count: number;
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
        transformResponse: (resp: resourceTypes[]) => {
          // Sorting function
          const sortByIndex = (a: resourceTypes, b: resourceTypes) =>
            a.index - b.index;

          // Recursive sorting function for children
          const sortResources = (resources: resourceTypes[]): resourceTypes[] =>
            resources
              .map((resource) => ({
                ...resource,
                children: resource.children
                  ? sortResources([...resource.children].sort(sortByIndex))
                  : undefined, // recursively sort children if present
              }))
              .sort(sortByIndex); // sort the main array by index

          const allResourceData = sortResources(resp);

          return allResourceData;
        },
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
          // Sorting function
          const sortByIndex = (a: resourceTypes, b: resourceTypes) =>
            a.index - b.index;

          // Recursive sorting function for children
          const sortResources = (resources: resourceTypes[]): resourceTypes[] =>
            resources
              .map((resource) => ({
                ...resource,
                children: resource.children
                  ? sortResources([...resource.children].sort(sortByIndex))
                  : undefined, // recursively sort children if present
              }))
              .sort(sortByIndex); // sort the main array by index

          // Sort and count non-parent items
          const allResourceData = sortResources(resp);
          const count = allResourceData.filter((item) => !item.is_parent).length;

          return { allResourceData, count };
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
          invalidatesTags: ["Roles"],
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
          invalidatesTags: ["Roles"],
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
