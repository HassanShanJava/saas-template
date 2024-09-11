import {
  Workout,
  workoutResponse,
  WorkoutPlansTableResponse,
} from "@/app/types";
import { apiSlice } from "@/features/api/apiSlice";
interface workoutQuery {
  query: string;
  org_id: number;
}
export const workoutApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    AddWorkout: builder.mutation<workoutResponse, Workout>({
      query: (workoutdata) => ({
        url: "/workout",
        method: "POST",
        body: workoutdata,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Workout"],
    }),
    GetAllWorkout: builder.query<WorkoutPlansTableResponse, workoutQuery>({
      query: (searchCritiria) => ({
        url: `/workout?org_id=${searchCritiria.org_id}&${searchCritiria.query}`,
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }),
      providesTags: ["Workout"],
    }),
  }),
});

export const { useAddWorkoutMutation, useGetAllWorkoutQuery } = workoutApi;
