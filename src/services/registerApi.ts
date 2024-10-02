import { apiSlice } from "@/features/api/apiSlice";

export const Register = apiSlice.injectEndpoints({
  endpoints(builder) {
    return {
      getlastRegisterSession: builder.query<any, any>({
        query: () => ({
          url: "/pos/register/last_session",
        }),
      }),
    };
  },
});
