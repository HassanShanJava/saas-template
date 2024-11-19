import { apiSlice } from "@/features/api/apiSlice";
import {
  CreateRoleTypes,
  GetRolesType,
  ResourceTypes,
  TranformedResourceRsp,
  UpdateRoleTypes,
} from "@/app/types/roles";

export const Roles = apiSlice.injectEndpoints({
  endpoints(builder) {
    return {
      getRoles: builder.query<GetRolesType[], number>({
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
        transformResponse: (resp: ResourceTypes[]) => {
          // Sorting function
          const sortByIndex = (a: ResourceTypes, b: ResourceTypes) =>
            a.index - b.index;

          // Recursive sorting function for children
          const sortResources = (resources: ResourceTypes[]): ResourceTypes[] =>
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
        transformResponse: (resp: ResourceTypes[]) => {
          // Sorting function
          const sortByIndex = (a: ResourceTypes, b: ResourceTypes) =>
            a.index - b.index;

          // Recursive sorting function for children
          const sortResources = (resources: ResourceTypes[]): ResourceTypes[] =>
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
      createRole: builder.mutation<any[], CreateRoleTypes>({
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
      updateRole: builder.mutation<any, UpdateRoleTypes>({
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
