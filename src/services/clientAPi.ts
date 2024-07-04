import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  CountryTypes,
  BusinessTypes,
  CoachTypes,
  sourceTypes,
  membershipplanTypes,
  ClientInputTypes,
  ClientResponseTypes
} from "../app/types";
const API_BASE_URL = import.meta.env.VITE_API_URL;

export const ClientAPi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  endpoints(builder) {
    return {
      getClientCount: builder.query<{ total_clients: number }, number>({
        query: (org_id) => ({
          url: `/client/getTotalClient/${org_id}`,
          headers: {
            Accept: "application/json",
          },
        }),
      }),
      getCountries: builder.query<CountryTypes[], void>({
        query: () => ({
          url: "/get_all_countries/",
          headers: {
            Accept: "application/json",
          },
        }),
      }),
      getCoaches: builder.query<CoachTypes[], number>({
        query: (org_id) => ({
          url: `/coach/getCoach/${org_id}`,
          headers: {
            Accept: "application/json",
          },
        }),
      }),
      getAllSource: builder.query<sourceTypes[], void>({
        query: () => ({
          url: "/get_all_sources/",
          headers: {
            Accept: "application/json",
          },
        }),
      }),
      getAllBusinesses: builder.query<BusinessTypes[], number>({
        query: (org_id) => ({
          url: `/client/business/${org_id}`,
          headers: {
            Accept: "application/json",
          },
        }),
      }),
      getAllMemberships: builder.query<membershipplanTypes[], number>({
        query: (org_id) => ({
          url: `/membership_plan/get_all/${org_id}`,
          headers: {
            Accept: "application/json",
          },
        }),
      }),
      getAllClient: builder.query<any[], number>({
        query: (org_id) => ({
          url: `/client/filter/?org_id=${org_id}`,
          headers: {
            Accept: "application/json",
          },
        }),
      }),
      AddClient: builder.mutation<ClientResponseTypes, ClientInputTypes>({
        query: (clientdata) => ({
          url: "/client/register",
          method: "POST",
          body: clientdata,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }),
      }),
    };
  },
});

export const {
  useGetClientCountQuery,
  useGetCountriesQuery,
  useGetCoachesQuery,
  useGetAllSourceQuery,
  useGetAllBusinessesQuery,
  useGetAllMembershipsQuery,
  useGetAllClientQuery,
  useAddClientMutation
} = ClientAPi;
