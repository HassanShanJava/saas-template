import { apiSlice } from "@/features/api/apiSlice";

export const ResetPassword = apiSlice.injectEndpoints({
  endpoints(builder) {
    return {
      sendResetEmail: builder.query<any, number>({
        query: (org_id) => ({
          url: `/role?org_id=${org_id}`,
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          providesTags: ["Reset"],
        }),
      }),
      verifyToken: builder.query<any, number>({
        query: (org_id) => ({
          url: `/role?org_id=${org_id}`,
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          providesTags: ["Reset"],
        }),
      }),
      confirmPassword: builder.query<any, number>({
        query: (org_id) => ({
          url: `/role?org_id=${org_id}`,
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          providesTags: ["Reset"],
        }),
      }),   
    };
  },
});

export const {
  useSendResetEmailQuery,
  useVerifyTokenQuery,
  useConfirmPasswordQuery,
} = ResetPassword;
