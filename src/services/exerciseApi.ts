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
            id: met.id,
            name: met.met_value,
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
            id: muscle.id,
            name: muscle.muscle_name,
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
            id: Equipment.id,
            name: Equipment.equipment_name,
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
            id: category.id,
            name: category.category_name,
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
            id: muscle.id,
            name: muscle.joint_name,
          })),
        providesTags: ["Exercise"],
      }),
      AddExercise: builder.mutation<
        ExerciseCreationResponse,
        createExerciseInputTypes
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
      getAllExercises: builder.query<
        ExerciseResponseViewType[],
        ExerciseQueryInput
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
      deleteExercise: builder.mutation<
        deleteExerciseResponse,
        number
      >({
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
  useGetExerciseByIdQuery
} = Exercise;
