import { counterTableType, CreateCounter } from "@/app/types";
import { apiSlice } from "@/features/api/apiSlice";

interface counterInput {
    query: string;
    org_id?: number;
}


export const Counter = apiSlice.injectEndpoints({
    endpoints(builder) {
        return {
            getCounters: builder.query<counterTableType, counterInput>({
                query: (searchCretiria) => ({
                    url: `/pos/counters?${searchCretiria.query}`,
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                    },
                }),
                providesTags: ["Counter"],
                transformResponse: (resp: counterTableType) => {
                    const { data, ...rest } = resp;

                    const updatedData = data.map(item => ({
                        ...item,
                        staff: item.staff.filter(staffMember => staffMember.id !== null),
                    }));

                    return {
                        ...rest,
                        data: updatedData,
                    };
                }
            }),
            createCounters: builder.mutation<any, CreateCounter>({
                query: (counter) => ({
                    url: `/pos/counters`,
                    method: "POST",
                    body: counter,
                    headers: {
                        Accept: "application/json",
                    },
                }),
                invalidatesTags: ["Counter"],
            }),
            updateCounters: builder.mutation<any, CreateCounter>({
                query: (counter) => ({
                    url: `/pos/counters`,
                    method: "PUT",
                    body: counter,
                    headers: {
                        Accept: "application/json",
                    },
                }),
                invalidatesTags: ["Counter"],
            }),
            deleteCounter: builder.mutation<any, number>({
                query: (id) => ({
                    url: `/pos/counters/${id}`,
                    method: "DELETE",
                    headers: {
                        Accept: "application/json",
                    },
                }),
                invalidatesTags: ["Counter"],
            }),
            getCounterById: builder.query<any, number>({
                query: (id) => ({
                    url: `/pos/counters/${id}`,
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                    },
                }),
                providesTags: ["Counter"],
            })

        };
    },
});


export const {
    useGetCountersQuery,
    useGetCounterByIdQuery,
    useCreateCountersMutation,
    useUpdateCountersMutation,
    useDeleteCounterMutation,
} = Counter
