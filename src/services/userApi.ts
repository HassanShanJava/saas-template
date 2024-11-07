import { apiSlice } from "@/features/api/apiSlice";
interface UserValidation {
  user_id: number;
}
interface ValidationResponse {
  user_id: number;
  status: string;
  notes: string;
  created_at: string;
}
export const Transaction = apiSlice.injectEndpoints({
  endpoints(builder) {
    return {
      getValidateUser: builder.query<ValidationResponse, UserValidation>({
        query: (userdata) => ({
          url: `/user/${userdata.user_id}/validate?user_type=staff`,
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }),
        providesTags: ["User"],
      }),
    };
  },
});

export const { useGetValidateUserQuery } = Transaction;
