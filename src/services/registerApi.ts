import {
  counterRegisterSession,
  RegisterationTableType,
  salesReportTableTypes,
} from "@/app/types";
import { apiSlice } from "@/features/api/apiSlice";
interface RegisterQueryInput {
  query: string;
  counter_id: number;
}

export const Register = apiSlice.injectEndpoints({
  endpoints(builder) {
    return {
      getlastRegisterSession: builder.query<counterRegisterSession, number>({
        query: (counter_id) => ({
          url: `/pos/counters/${counter_id}/last_session`,
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }),
        providesTags: ["Register"],
      }),
      openRegister: builder.mutation<
        counterRegisterSession,
        counterRegisterSession
      >({
        query: (registerdata) => ({
          url: "/pos/counter/register",
          method: "POST",
          body: registerdata,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }),
        invalidatesTags: ["Register"],
      }),
      closeRegister: builder.mutation<
        counterRegisterSession,
        counterRegisterSession
      >({
        query: (registerdata) => ({
          url: "/pos/counter/register",
          method: "PUT",
          body: registerdata,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }),
        invalidatesTags: ["Register"],
      }),
      getAllRegisterSession: builder.query<
        RegisterationTableType,
        RegisterQueryInput
      >({
        query: (searchCriteria) => ({
          url: `/pos/counters/${searchCriteria.counter_id}/register${searchCriteria.query.length > 0 ? "?" + searchCriteria.query : ""}`,
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }),
        providesTags: ["Register"],
      }),
      getAlltransaction: builder.query<
        salesReportTableTypes,
        RegisterQueryInput
      >({
        query: (searchCriteria) => ({
          url: `/pos/counters/${searchCriteria.counter_id}/transactions${searchCriteria.query.length > 0 ? "?" + searchCriteria.query : ""}`,
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }),
        providesTags: ["Transaction"],
      }),
    };
  },
});

export const {
  useCloseRegisterMutation,
  useOpenRegisterMutation,
  useGetlastRegisterSessionQuery,
  useGetAllRegisterSessionQuery,
  useGetAlltransactionQuery,
} = Register;
