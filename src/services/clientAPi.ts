import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_BASE_URL = import.meta.env.VITE_API_URL_two;

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  endpoints(builder) {
    return {
      getClientCount: builder.query<any, number>({
        query: (org_id) => `/client/organization/${org_id}/clients/count`,
      }),
    };
  },
});

export const { useGetClientCountQuery } = api;
