import { CountryTypes, SourceTypes } from "@/app/types";
import { apiSlice } from "@/features/api/apiSlice";

export const Common = apiSlice.injectEndpoints({
    endpoints(builder) {
        return {
            getCountries: builder.query<CountryTypes[], void>({
                query: () => ({
                    url: "/countries",
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                    },
                    
                }),
            }),
            getAllSource: builder.query<SourceTypes[], void>({
                query: () => ({
                    url: "/sources",
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                    },
                    providesTags: ["Common"],
                }),
            }),

        };
    },
});

export const {
    useGetCountriesQuery,
    useGetAllSourceQuery
} = Common;
