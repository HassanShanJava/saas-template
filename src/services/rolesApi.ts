import { apiSlice } from "@/features/api/apiSlice";
import {
  CreateRoleTypes,
  GetRolesType,
  ResourceTypes,
  TranformedResourceRsp,
  UpdateRoleTypes,
} from "@/app/types/roles";
import { ApiResponse } from "@/app/types/shared_types";

export const Roles = apiSlice.injectEndpoints({
  endpoints(builder) {
    return {
      getRoles: builder.query<GetRolesType[], void>({
        query: () => ({
          url: `/role`,
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          providesTags: ["Roles"],
        }),
      }),
      getResourceById: builder.query<ResourceTypes[], number>({
        query: (role_id) => ({
          url: `/role/${role_id}`,
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
      createRole: builder.mutation<ApiResponse, CreateRoleTypes>({
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
      updateRole: builder.mutation<ApiResponse, UpdateRoleTypes>({
        query: (roledata) => ({
          url: `/role/${roledata.id}`,
          method: "PUT",
          headers: {
            Accept: "application/json",
          },
          body: roledata,
          invalidatesTags: ["Roles"],
        }),
      }),
      deleteRole: builder.mutation<ApiResponse, number>({
        query: (id) => ({
          url: `/role/${id}`,
          method: "DELETE",
          headers: {
            Accept: "application/json",
          },
          invalidatesTags: ["Roles"],
        }),
      }),
    };
  },
});

export const {
  useGetRolesQuery,
  useGetResourceByIdQuery,
  useGetAllResourcesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} = Roles;
