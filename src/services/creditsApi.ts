import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  createCreditsType,
  creditsResponseType,
  deleteCreditsType,
  updateCreditsType,
} from "../app/types";
import { RootState } from "@/app/store";
const API_BASE_URL = import.meta.env.VITE_API_URL;

export const Credits = createApi({
  reducerPath: "api/credits",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.userToken;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      headers.set("Access-Control-Allow-Origin", `*`);
      return headers;
    },
  }),
  tagTypes: ["Credits"],
  endpoints(builder) {
    return {
      getCredits: builder.query<creditsResponseType[], number>({
        query: (org_id) => ({
          url: `/membership_plan/credits/getAll?org_id=${org_id}`,
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }),
        providesTags: ["Credits"],
      }),
      createCredits: builder.mutation<any, createCreditsType>({
        query: (creditsdata) => ({
          url: `/membership_plan/credits`,
          method: "POST",
          body: creditsdata,
          headers: {
            Accept: "application/json",
          },
        }),
        invalidatesTags: ["Credits"],
      }),
      updateCredits: builder.mutation<any, updateCreditsType>({
        query: (creditsdata) => ({
          url: `/membership_plan/credits`,
          method: "PUT",
          body: creditsdata,
          headers: {
            Accept: "application/json",
          },
        }),
        invalidatesTags: ["Credits"],
      }),
      deleteCredits: builder.mutation<any, any>({
        query: (creditsdata) => ({
          url: `/membership_plan/credits`,
          method: "DELETE",
          body: creditsdata,
          headers: {
            Accept: "application/json",
          },
        }),
        invalidatesTags: ["Credits"],
      }),
      getCreditsById: builder.query<any, number>({
        query: (org_id) => ({
          url: `/membership_plan/credits?credit_id=${org_id}`,
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }),
        providesTags: ["Credits"],
      }),
    };
  },
});

export const {
  useGetCreditsQuery,
  useCreateCreditsMutation,
  useUpdateCreditsMutation,
  useDeleteCreditsMutation,
  useGetCreditsByIdQuery,
} = Credits;
