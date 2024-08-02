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
          url: `/facilities?org_id=${org_id}`,
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }),
        providesTags: ["Credits"],
      }),
      createCredits: builder.mutation<any, createCreditsType>({
        query: (creditsdata) => ({
          url: `/facilities`,
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
          url: `/facilities`,
          method: "PUT",
          body: creditsdata,
          headers: {
            Accept: "application/json",
          },
        }),
        invalidatesTags: ["Credits"],
      }),
      deleteCredits: builder.mutation<any, number>({
        query: (facility_id) => ({
          url: `/facilities/${facility_id}`,
          method: "DELETE",
          headers: {
            Accept: "application/json",
          },
        }),
        invalidatesTags: ["Credits"],
      }),
      getCreditsById: builder.query<any, number>({
        query: (facility_id) => ({
          url: `/facilities/${facility_id}`,
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
