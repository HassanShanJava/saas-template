import { sellForm } from "@/app/types";
import { apiSlice } from "@/features/api/apiSlice";
interface transactionInput {
  query: string;
  counter_id: number;
}

export const Transaction = apiSlice.injectEndpoints({
  endpoints(builder) {
    return {
      createTransaction: builder.mutation<any, sellForm>({
        query: (transactionbody) => ({
          url: `/pos/counters/${transactionbody.counter_id}/registers/${transactionbody.batch_id}/transactions`,
          method: "POST",
          body: transactionbody,
          headers: {
            Accept: "application/json",
          },
        }),
        invalidatesTags: ["Transaction"],
      }),
      getTransaction: builder.query<any, transactionInput>({
        query: (searchCretiria) => ({
          url: `/pos/counters/${searchCretiria.counter_id}/transactions${searchCretiria.query.length > 0 ? "?" + searchCretiria.query : ""}`,
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }),
        providesTags: ["Transaction"],
      }),
      getTransactionById: builder.query<sellForm, { counter_id: number, transaction_id: number }>({
        query: (payload) => ({
          url: `/pos/counters/${payload.counter_id}/transactions/${payload.transaction_id}`,
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
  useCreateTransactionMutation,
  useGetTransactionQuery,
  useGetTransactionByIdQuery,
} = Transaction;
