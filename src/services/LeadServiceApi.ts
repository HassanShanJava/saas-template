import { createApi,fetchBaseQuery } from "@reduxjs/toolkit/query";
import { LeadInput, LeadState } from "../app/types";
const {}=import.meta.env;

export const Api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "",
    prepareHeaders: (headers, { getState }) => {
      const token = true;
      if (token) {
        // headers.set("Authorization", `Bearer ${token}`);
        headers.set("Accept","application/json");
        headers.set("Content-Type", "application/json");
      }
      return headers;
    },
  }),
  tagTypes: ["Lead"],
  endpoints(builder) {
    return {
      setLogin: builder.mutation<LeadState, LeadInput>({
        query: (leaddata) => ({
          url: "Lead/register/lead",
          method: "POST",
          body: leaddata,
        }),
      }),
      getAllLeads:builder.query<Number,any[]>({
        query:(queryParams:any)=>``
      })
    };
  },
});



