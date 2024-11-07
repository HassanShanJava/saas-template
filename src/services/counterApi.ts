import { CounterInput, CounterTableType, CreateCounter } from "@/app/types/pos/counter";
import { apiSlice } from "@/features/api/apiSlice";

export const Counter = apiSlice.injectEndpoints({
    endpoints(builder) {
        return {
            getCounters: builder.query<CounterTableType, CounterInput>({
                query: (searchCretiria) => ({
                    url: `/pos/counters?${searchCretiria.query}`,
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                    },
                }),
                providesTags: ["Counter"],
                transformResponse: (resp: CounterTableType) => {
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
            createCounters: builder.mutation<unknown, CreateCounter>({
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
            updateCounters: builder.mutation<unknown, CreateCounter>({
                query: (counter) => ({
                    url: `/pos/counters/${counter.id}`,
                    method: "PUT",
                    body: counter,
                    headers: {
                        Accept: "application/json",
                    },
                }),
                invalidatesTags: ["Counter"],
            }),
            deleteCounter: builder.mutation<unknown, number>({
                query: (id) => ({
                    url: `/pos/counters/${id}`,
                    method: "DELETE",
                    headers: {
                        Accept: "application/json",
                    },
                }),
                invalidatesTags: ["Counter"],
            }),
            getCounterById: builder.query<unknown, number>({
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
