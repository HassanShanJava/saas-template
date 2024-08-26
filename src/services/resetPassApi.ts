import { ResetPasswordType } from "@/app/types";
import { apiSlice } from "@/features/api/apiSlice";

export const ResetPassword = apiSlice.injectEndpoints({
  endpoints(builder) {
    return {
      sendResetEmail: builder.mutation<any, { email: string }>({
        query: (forgotpassowordData) => ({
          url: `/forget_password`,
          method: "POST",
          body: forgotpassowordData,
          headers: {
            Accept: "application/json",
          },
          invalidateTags: ["Reset"],
        }),
      }),
      verifyToken: builder.query<any, string>({
        query: (token) => ({
          url: `/reset_password/${token}`,
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          providesTags: ["Reset"],
        }),
      }),
      resetPassword: builder.mutation<any, ResetPasswordType>({
        query: (resetPasswordData) => ({
          url: `/reset_password`,
          method: "POST",
          body: resetPasswordData,
          headers: {
            Accept: "application/json",
          },
          invalidateTags: ["Reset"],
        }),
      }),
    };
  },
});

export const {
  useSendResetEmailMutation,
  useVerifyTokenQuery,
  useResetPasswordMutation,
} = ResetPassword;
