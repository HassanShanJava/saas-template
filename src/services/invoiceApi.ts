import { LinkedMembers, LinkedMembersInvoiceDataResponse } from "@/app/types/pos/invoice";
import { TransactionData } from "@/app/types/pos/transactions";
import { apiSlice } from "@/features/api/apiSlice";

export const Invoice = apiSlice.injectEndpoints({
    endpoints(builder) {
        return {
            getTransactionByMemberId: builder.query<TransactionData, { id: number, query: string }>({
                query: ({ id, query }) => ({
                    url: `/pos/invoices/${id}${query !== "" ? "?" + query : ""}`,
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                    },
                }),
                providesTags: ["Invoice"],
            }),
            
            getLinkedMebers: builder.query<LinkedMembersInvoiceDataResponse, { id: number, query: string }>({
                query: ({ id, query }) => ({
                    url: `/pos/members/transaction?member_id=${id}${query !== "" ? "&" + query : ""}`,
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                    },
                }),
                providesTags: ["Invoice"],
            }),

            addLinkedMembers:builder.mutation<LinkedMembersInvoiceDataResponse, LinkedMembers[]>({
                query: (payload) => ({
                    url: `/pos/add_members`,
                    method: "POST",
                    body: payload,
                    headers: {
                        Accept: "application/json",
                    },
                }),
                invalidatesTags: ["Invoice"],
            }),
            deleteLinkedMember:builder.mutation<any, number>({
                query: (id) => ({
                    url: `/pos/members/${id}`,
                    method: "DELETE",
                    headers: {
                        Accept: "application/json",
                    },
                }),
                invalidatesTags: ["Invoice"],
            }),

        };
    },
});

export const {
    useGetTransactionByMemberIdQuery
} = Invoice;
