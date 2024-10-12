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
          url: `/pos/counter/register/last_session/${counter_id}`,
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
        query: (SearchCriteria) => ({
          url: `/pos/counter/register/${SearchCriteria.counter_id}?${SearchCriteria.query}`,
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
        query: (SearchCriteria) => ({
          url: `/pos/counter/${SearchCriteria.counter_id}/transactions?${SearchCriteria.query}`,
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }),
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
