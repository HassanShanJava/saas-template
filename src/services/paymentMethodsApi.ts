import { PaymentMethodCreate, PaymentMethodPlugin, PaymentMethodUpdate } from "@/app/types";
import { apiSlice } from "@/features/api/apiSlice";

export const PaymentMethodsApi = apiSlice.injectEndpoints({
    endpoints(builder) {
        return {
            getAllPaymentMethods: builder.query<PaymentMethodPlugin[], Record<string, never>>({
                query: () => ({
                    url: "/payment_method",
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                    },
                }),
                providesTags: ["PaymentMethods"],
                transformResponse: (resp: PaymentMethodPlugin[]) => resp
            }),
            getAllEnabledPaymentMethods: builder.query<PaymentMethodPlugin[], Record<string, never>>({
                query: () => ({
                    url: "/payment_method/enabled",
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                    },
                }),
                providesTags: ["PaymentMethods"],
                transformResponse: (resp: PaymentMethodPlugin[]) => resp
            }),
            updatePaymentMethod: builder.mutation<{message: string}, PaymentMethodUpdate>({
                query: (payment_method) => ({
                    url: `/payment_method/${payment_method.id}`,
                    method: "PUT",
                    body: payment_method.data,
                    headers: {
                        Accept: "application/json",
                    },
                }),
                invalidatesTags: ["PaymentMethods"],
            }),
        };
    },
});


export const {
    useGetAllPaymentMethodsQuery,
    useGetAllEnabledPaymentMethodsQuery,
    useUpdatePaymentMethodMutation
} = PaymentMethodsApi
