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
          url: `/pos/counter/register/transactions/`,
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
          url: `/pos/counter/${searchCretiria.counter_id}/transactions${searchCretiria.query.length > 0 ? "?" + searchCretiria.query : ""}`,
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
} = Transaction;
