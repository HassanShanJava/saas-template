import { apiSlice } from "@/features/api/apiSlice";
import {
  baseExerciseApiResponse,
  EquipmentApiResponse,
  muscleserverResponse,
  CategoryApiResponse,
  JointApiResponse,
} from "@/app/types";

export const Exercise = apiSlice.injectEndpoints({
  endpoints(builder) {
    return {
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
    };
  },
});

export const {
  useGetAllMuscleQuery,
  useGetAllEquipmentsQuery,
  useGetAllCategoryQuery,
  useGetAllJointsQuery,
} = Exercise;
