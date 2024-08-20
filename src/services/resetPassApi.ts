import { apiSlice } from "@/features/api/apiSlice";

export const ResetPassword = apiSlice.injectEndpoints({
  endpoints(builder) {
    return {
      sendResetEmail: builder.mutation<any, {email:string}>({
        query: (forgotpassowordData) => ({
          url: `/forget_password`,
          method: "POST",
          body:forgotpassowordData,
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
      resetPassword: builder.mutation<any, {id:number,org_id:number, new_password:string, confirm_password:string}>({
        query: (resetPasswordData) => ({
          url: `/reset_password`,
          method: "POST",
          bosy:resetPasswordData,
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
