import {
  CreateFoodTypes,
  FoodTableResponse,
  groupCreateType,
  groupRespType,
} from "@/app/types";
import { apiSlice } from "@/features/api/apiSlice";

interface foodsInput {
  query: string;
  org_id: number;
}

export const Foods = apiSlice.injectEndpoints({
  endpoints(builder) {
    return {
      getFoods: builder.query<FoodTableResponse, foodsInput>({
        query: (searchCretiria) => ({
          url: `/food?org_id=${searchCretiria.org_id}&${searchCretiria.query}`,
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }),
        providesTags: ["Foods"],
      }),
      createFoods: builder.mutation<any, CreateFoodTypes>({
        query: (fooddata) => ({
          url: `/food`,
          method: "POST",
          body: fooddata,
          headers: {
            Accept: "application/json",
          },
        }),
        invalidatesTags: ["Foods"],
      }),
      updateFoods: builder.mutation<any, CreateFoodTypes & { id: number }>({
        query: (fooddata) => ({
          url: `/food`,
          method: "PUT",
          body: fooddata,
          headers: {
            Accept: "application/json",
          },
        }),
        invalidatesTags: ["Foods"],
      }),
      deleteFoods: builder.mutation<any, number>({
        query: (food_id) => ({
          url: `/food/${food_id}`,
          method: "DELETE",
          headers: {
            Accept: "application/json",
          },
        }),
        invalidatesTags: ["Foods"],
      }),
      getFoodById: builder.query<any, number>({
        query: (food_id) => ({
          url: `/food/${food_id}`,
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }),
        providesTags: ["Foods"],
      }),
      getFoodList: builder.query<any[], number>({
        query: (org_id) => ({
          url: `/food/list/${org_id}`,
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }),
        providesTags: ["Foods"],
      }),
    };
  },
});

export const {
  useGetFoodsQuery,
  useCreateFoodsMutation,
  useUpdateFoodsMutation,
  useDeleteFoodsMutation,
  useGetFoodByIdQuery,
  useGetFoodListQuery,
} = Foods;
