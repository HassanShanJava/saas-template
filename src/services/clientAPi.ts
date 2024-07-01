import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  CountryTypes,
  BusinessTypes,
  CoachTypes,
  sourceTypes,
  membershipplanTypes,
} from "../app/types";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
const API_BASE_URL = import.meta.env.VITE_API_URL;

export const ClientAPi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  endpoints(builder) {
    return {
      getClientCount: builder.query<{ total_clients: number }, number>({
        query: (org_id) => ({
          url: `/client/organization/${org_id}/clients/count`,
          headers: {
            Accept: "application/json",
          },
        })
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
          url: `/coach/coaches/${org_id}`,
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
          url: `/client/business/clients/${org_id}`,
          headers: {
            Accept: "application/json",
          },
        }),
      }),
      getAllMemberships: builder.query<membershipplanTypes[], number>({
        query: (org_id) => ({
          url: `/membership/get_all_membership_plan/${org_id}`,
          headers: {
            Accept: "application/json",
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
} = ClientAPi;
