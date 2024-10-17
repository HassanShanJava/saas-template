import { apiSlice } from "@/features/api/apiSlice";

export const Organization = apiSlice.injectEndpoints({
    endpoints(builder) {
        return {
            getOrgTaxType: builder.query<{ tax_type: string }, number>({
                query: (org_id) => ({
                    url: `/organization/${org_id}/tax_type/`,
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                    },
                }),
                providesTags: ["Organization"],
            }),
        };
    },
});

export const { useGetOrgTaxTypeQuery } = Organization;
