import { counterRegisterSession } from "@/app/types";
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
          url: `/pos/counter/register/last_session?counter_id=${counter_id}`,
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }),
        providesTags: ["register"],
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
        invalidatesTags: ["register"],
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
        invalidatesTags: ["register"],
      }),

      // getAllRegisterSession: builder.query<number,RegisterQueryInput>({}),
    };
  },
});

export const {
  useCloseRegisterMutation,
  useOpenRegisterMutation,
  useGetlastRegisterSessionQuery,
} = Register;
