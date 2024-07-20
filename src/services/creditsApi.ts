import {
  createCreditsType,
  creditsResponseType,
  updateCreditsType,
} from "../app/types";
import { apiSlice } from "@/features/api/apiSlice";

export const Credits = apiSlice.injectEndpoints({
  endpoints(builder) {
    return {
      getCredits: builder.query<creditsResponseType[], number>({
        query: (org_id) => ({
          url: `/membership_plan/facilities/getAll?org_id=${org_id}`,
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }),
        providesTags: ["Credits"],
      }),
      createCredits: builder.mutation<any, createCreditsType>({
        query: (creditsdata) => ({
          url: `/membership_plan/facilities`,
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
          url: `/membership_plan/facilities`,
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
          url: `/membership_plan/facilities`,
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
          url: `/membership_plan/facilities?credit_id=${org_id}`,
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
