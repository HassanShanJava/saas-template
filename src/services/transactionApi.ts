import { SellForm, TransactionTable } from "@/app/types";
import { apiSlice } from "@/features/api/apiSlice";
interface transactionInput {
  query: string;
  counter_id: number;
}

export const Transaction = apiSlice.injectEndpoints({
  endpoints(builder) {
    return {
      createTransaction: builder.mutation<any, SellForm>({
        query: (transactionbody) => ({
          url: `/pos/registers/${transactionbody.batch_id}/transactions`,
          method: "POST",
          body: transactionbody,
          headers: {
            Accept: "application/json",
          },
        }),
        invalidatesTags: ["Transaction"],
      }),
      getTransaction: builder.query<TransactionTable, transactionInput>({
        query: (searchCretiria) => ({
          url: `/pos/counters/${searchCretiria.counter_id}/transactions${searchCretiria.query.length > 0 ? "?" + searchCretiria.query : ""}`,
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }),
        providesTags: ["Transaction"],
      }),
      getTransactionById: builder.query<SellForm, { counter_id: number, transaction_id: number }>({
        query: (payload) => ({
          url: `/pos/transactions/${payload.transaction_id}`,
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }),
        providesTags: ["Transaction"],
      }),
      patchTransaction: builder.mutation<any, { status: string, id: number }>({
        query: (payload) => ({
          url: `/pos/transactions/${payload.id}/status`,
          method: "PATCH",
          body: { status: payload.status },
          headers: {
            Accept: "application/json",
          },
        }),
        invalidatesTags: ["Transaction"],
      }),
    };
  },
});

export const {
  useCreateTransactionMutation,
  useGetTransactionQuery,
  useGetTransactionByIdQuery,
  usePatchTransactionMutation,
} = Transaction;
