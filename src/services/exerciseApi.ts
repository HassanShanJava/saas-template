import { apiSlice } from "@/features/api/apiSlice";
import {
  baseExerciseApiResponse,
  EquipmentApiResponse,
  muscleserverResponse,
  CategoryApiResponse,
  JointApiResponse,
  MetApiResponse,
  ExerciseCreationResponse,
  createExerciseInputTypes,
  ExerciseResponseViewType,
  deleteExerciseResponse,
  deleteExerciseInput,
  ExerciseTableTypes,
  ExerciseResponseServerViewType,
  ExerciseTableServerTypes,
  ExerciseCreationInputTypes,
} from "@/app/types";

interface ExerciseQueryInput {
  query: string;
  org_id: number;
}
export const Exercise = apiSlice.injectEndpoints({
  endpoints(builder) {
    return {
      getAllMet: builder.query<baseExerciseApiResponse[], void>({
        query: () => ({
          url: "/exercise/met",
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }),
        transformResponse: (resp: MetApiResponse[]) =>
          resp.map((met) => ({
            value: met.id,
            label: met.met_value,
          })),
        providesTags: ["Exercise"],
      }),
      getAllMuscle: builder.query<baseExerciseApiResponse[], void>({
        query: () => ({
          url: "/exercise/muscles",
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }),
        transformResponse: (resp: muscleserverResponse[]) =>
          resp.map((muscle) => ({
            value: muscle.id,
            label: muscle.muscle_name,
          })),
        providesTags: ["Exercise"],
      }),
      getAllEquipments: builder.query<baseExerciseApiResponse[], void>({
        query: () => ({
          url: "/exercise/equipments",
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }),
        transformResponse: (resp: EquipmentApiResponse[]) =>
          resp.map((Equipment) => ({
            value: Equipment.id,
            label: Equipment.equipment_name,
          })),
        providesTags: ["Exercise"],
      }),
      getAllCategory: builder.query<baseExerciseApiResponse[], void>({
        query: () => ({
          url: "/exercise/category",
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }),
        transformResponse: (resp: CategoryApiResponse[]) =>
          resp.map((category) => ({
            value: category.id,
            label: category.category_name,
          })),
        providesTags: ["Exercise"],
      }),
      getAllJoints: builder.query<baseExerciseApiResponse[], void>({
        query: () => ({
          url: "/exercise/primary_joints",
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }),
        transformResponse: (resp: JointApiResponse[]) =>
          resp.map((muscle) => ({
            value: muscle.id,
            label: muscle.joint_name,
          })),
        providesTags: ["Exercise"],
      }),
      AddExercise: builder.mutation<
        ExerciseCreationResponse,
        ExerciseCreationInputTypes
      >({
        query: (exercisedata) => ({
          url: "/exercise",
          method: "POST",
          body: exercisedata,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }),
        invalidatesTags: ["Exercise"],
      }),
      getAllExercises: builder.query<ExerciseTableTypes, ExerciseQueryInput>({
        query: (SearchCriteria) => ({
          url: `/exercise?org_id=${SearchCriteria.org_id}&${SearchCriteria.query}`,
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }),
        // transformResponse:(resp:ExerciseTableServerTypes)=>
        //   resp.data
        transformResponse: (
          response: ExerciseTableServerTypes
        ): ExerciseTableTypes => ({
          ...response,
          data: response.data.map((record) => ({
            ...record,
            primary_joint_ids: record.primary_joints.map(
              (coach) => coach.value
            ),
            primary_muscle_ids: record.primary_muscles.map(
              (coach) => coach.value
            ),
            equipment_ids: record.equipments.map((coach) => coach.value),
          })),
        }),
        providesTags: ["Exercise"],
      }),
      deleteExercise: builder.mutation<deleteExerciseResponse, number>({
        query: (ExerciseId) => ({
          url: `/exercise/${ExerciseId}`,
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }),
        invalidatesTags: ["Exercise"],
      }),
      updateExercise: builder.mutation<any, any>({
        query: (ExerciseData) => ({
          url: "/exercise",
          method: "PUT",
          body: ExerciseData,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }),
        invalidatesTags: ["Exercise"],
      }),
      getExerciseById: builder.query<ExerciseResponseViewType, number>({
        query: (ExerciseId) => ({
          url: `/exercise/${ExerciseId}`,
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }),
        providesTags: (result, error, arg) => [{ type: "Exercise", id: arg }],
      }),
    };
  },
});

export const {
  useGetAllMetQuery,
  useGetAllMuscleQuery,
  useGetAllEquipmentsQuery,
  useGetAllCategoryQuery,
  useGetAllJointsQuery,
  useAddExerciseMutation,
  useGetAllExercisesQuery,
  useDeleteExerciseMutation,
  useUpdateExerciseMutation,
  useGetExerciseByIdQuery,
} = Exercise;
