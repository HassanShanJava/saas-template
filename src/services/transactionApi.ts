import { sellForm } from "@/app/types";
import { apiSlice } from "@/features/api/apiSlice";


export const Transaction = apiSlice.injectEndpoints({
  endpoints(builder) {
    return {
      createTransaction: builder.mutation<any,sellForm>({
        query: (transactionbody) => ({
          url: `/pos/counter/register/transactions/`,
          method: "POST",
          body:transactionbody,
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
    useCreateTransactionMutation
  } = Transaction;
  