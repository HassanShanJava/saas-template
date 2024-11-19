import {
  Workout,
  workoutResponse,
  WorkoutPlansTableResponse,
  Workoutupdate,
  WorkoutDatabyId,
  WorkoutUpdateResponse,
  workoutUpdateStatus,
  days,
  ExerciseTableServerTypes,
  getWorkoutdayExerciseResponse,
  exerciseByWorkoutDayUpdateInput,
  exerciseByWorkoutDayUpdateResponse,
  workoutDayExerciseInput,
} from "@/app/types";
import { apiSlice } from "@/features/api/apiSlice";
interface workoutQuery {
  query: string;
  org_id: number;
}

interface WorkoutQueryParams {
  workoutId?: string;
  include_days?: boolean;
  include_days_and_exercises?: boolean;
}
interface verifyWorkout {
  id: number;
}
export const workoutApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addWorkout: builder.mutation<workoutResponse, Workout>({
      query: (workoutdata) => ({
        url: "/workouts",
        method: "POST",
        body: workoutdata,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Workout"],
    }),
    getAllWorkout: builder.query<WorkoutPlansTableResponse, workoutQuery>({
      query: (searchCritiria) => ({
        url: `/workouts?org_id=${searchCritiria.org_id}&${searchCritiria.query}`,
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }),
      providesTags: ["Workout"],
    }),
    deleteWorkout: builder.mutation<number, number>({
      query: (workoutid) => ({
        url: `/workouts/${workoutid}`,
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Workout"],
    }),
    updateWorkout: builder.mutation<WorkoutUpdateResponse, Workoutupdate>({
      query: (workoutdata) => ({
        url: `/workouts/${workoutdata.id}`,
        method: "PUT",
        body: workoutdata,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Workout"],
    }),
    updateWorkoutgrid: builder.mutation<
      WorkoutUpdateResponse,
      workoutUpdateStatus
    >({
      query: (workoutdata) => ({
        url: `/workouts/${workoutdata.id}`,
        method: "PUT",
        body: workoutdata,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Workout"],
    }),
    getWorkoutById: builder.query<WorkoutDatabyId, WorkoutQueryParams>({
      query: ({ workoutId, include_days, include_days_and_exercises }) => {
        const params = new URLSearchParams();

        if (include_days) params.append("include_days", "true");
        if (include_days_and_exercises)
          params.append("include_days_and_exercises", "true");

        return {
          url: `/workouts/${workoutId}?${params.toString()}`,
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        };
      },
      providesTags: ["Workout"],
    }),
    addWorkoutDay: builder.mutation<days, days>({
      query: (workoutdata) => ({
        url: `/workouts/${workoutdata.workout_id}/days`,
        method: "POST",
        body: workoutdata,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Workout"],
    }),
    updateWorkoutDay: builder.mutation<days, days>({
      query: (workoutdata) => ({
        url: `/workouts/${workoutdata.workout_id}/days/${workoutdata.id}`,
        method: "PUT",
        body: workoutdata,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Workout"],
    }),
    deleteWorkoutDay: builder.mutation<
      { status: number; message: string },
      {
        workout_id: number;
        id: number;
      }
    >({
      query: (workoutdata) => ({
        url: `/workouts/${workoutdata.workout_id}/days/${workoutdata.id}`,
        method: "DELETE",
        headers: {
          Accept: "application/json",
        },
      }),
      invalidatesTags: ["Workout"],
    }),
    getAllExerciseForWorkout: builder.query<
      ExerciseTableServerTypes,
      workoutQuery
    >({
      query: (SearchCriteria) => ({
        url: `/exercise?org_id=${SearchCriteria.org_id}&${SearchCriteria.query}`,
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }),
      providesTags: ["Exercise"],
    }),
    addExerciseInWorkout: builder.mutation<
      getWorkoutdayExerciseResponse,
      workoutDayExerciseInput
    >({
      query: (workoutdata) => ({
        url: `/workouts/days/${workoutdata.workout_day_id}/exercises`,
        method: "POST",
        body: workoutdata,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Workout"],
    }),
    updateExerciseInWorkout: builder.mutation<
      exerciseByWorkoutDayUpdateResponse,
      exerciseByWorkoutDayUpdateInput
    >({
      query: (workoutdata) => ({
        url: `/workouts/days/exercises/${workoutdata.id}`,
        method: "PUT",
        body: workoutdata,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Workout"],
    }),
    getExerciseByWorkoutDayId: builder.query<
      getWorkoutdayExerciseResponse[],
      number
    >({
      query: (workoutdayId) => ({
        url: `/workouts/days/${workoutdayId}/exercises`,
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }),
      providesTags: ["Workout"],
    }),
    deleteExerciseInWorkoutday: builder.mutation<
      { status: number; message: string },
      {
        workout_id: number;
        exercise_id: number;
      }
    >({
      query: (workoutdata) => ({
        url: `/workouts/${workoutdata.workout_id}/days/exercises/${workoutdata.exercise_id}`,
        method: "DELETE",
        headers: {
          Accept: "application/json",
        },
      }),
      invalidatesTags: ["Workout"],
    }),
    verifyWorkoutCreation: builder.mutation<
      { message: string; status: number },
      verifyWorkout
    >({
      query: (workoutdata) => ({
        url: `/workouts/${workoutdata.id}/verify`,
        method: "POST",
        // body: workoutId,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Workout"],
    }),
  }),
});

export const {
  useAddWorkoutMutation,
  useGetAllWorkoutQuery,
  useDeleteWorkoutMutation,
  useUpdateWorkoutMutation,
  useGetWorkoutByIdQuery,
  useUpdateWorkoutgridMutation,
  useAddWorkoutDayMutation,
  useDeleteWorkoutDayMutation,
  useUpdateWorkoutDayMutation,
  useGetAllExerciseForWorkoutQuery,
  useAddExerciseInWorkoutMutation,
  useUpdateExerciseInWorkoutMutation,
  useGetExerciseByWorkoutDayIdQuery,
  useDeleteExerciseInWorkoutdayMutation,
  useVerifyWorkoutCreationMutation,
} = workoutApi;