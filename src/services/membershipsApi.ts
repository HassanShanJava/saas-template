import { RootState } from "@/app/store";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const Memberships = createApi({
  reducerPath: "api/memberships",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.userToken;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      headers.set("Access-Control-Allow-Origin", `*`);
      return headers;
    },
  }),
  tagTypes: ["Memberships"],
  endpoints(builder) {
    return {
      getMemberships: builder.query<any[], number>({
        query: (org_id) => ({
          url: `/membership_plan/income_category/getAll?org_id=${org_id}`,
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }),
        providesTags: ["Memberships"],
      }),
      createMemberships: builder.mutation<any, any[]>({
        query: (membershipsydata) => ({
          url: `/membership_plan/income_category`,
          method: "POST",
          body: membershipsydata,
          headers: {
            Accept: "application/json",
          },
        }),
        invalidatesTags: ["Memberships"],
      }),
      updateMemberships: builder.mutation<any, any>({
        query: (membershipsydata) => ({
          url: `/membership_plan/income_category`,
          method: "PUT",
          body: membershipsydata,
          headers: {
            Accept: "application/json",
          },
        }),
        invalidatesTags: ["Memberships"],
      }),
      deleteMemberships: builder.mutation<any, any>({
        query: (membershipsydata) => ({
          url: `/membership_plan/income_category`,
          method: "DELETE",
          body: membershipsydata,
          headers: {
            Accept: "application/json",
          },
        }),
        invalidatesTags: ["Memberships"],
      }),
      getMembershipsById: builder.query<any, number>({
        query: (membership_id) => ({
          url: `/membership_plan/income_category?income_category_id=${membership_id}`,
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }),
        providesTags: ["Memberships"],
      }),
    };
  },
});

export const {
  useGetMembershipsQuery,
  useCreateMembershipsMutation,
  useUpdateMembershipsMutation,
  useDeleteMembershipsMutation,
  useGetMembershipsByIdQuery,
} = Memberships;
