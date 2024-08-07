import { createFoodTypes, groupCreateType, groupRespType } from "@/app/types";
import { apiSlice } from "@/features/api/apiSlice";

interface foodsInput{
	query:string,
	org_id:number
}


export const Foods = apiSlice.injectEndpoints({
  endpoints(builder) {
    return {
      getFoods: builder.query<any[], foodsInput>({
        query: (searchCretiria) => ({
          url: `/foods?org_id=${searchCretiria.org_id}&${searchCretiria.query}`,
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }),
      }),
      createFoods: builder.query<any, createFoodTypes>({
        query: (fooddata) => ({
          url: `/foods`,
          method: "POST",
          body: fooddata,
          headers: {
            Accept: "application/json",
          },
        }),
      }),
      updateFoods: builder.query<any, createFoodTypes & {id:number}>({
        query: (fooddata) => ({
          url: `/foods`,
          method: "PUT",
          body: fooddata,
          headers: {
            Accept: "application/json",
          },
        }),
      }),
      deleteFoods: builder.query<any[], number>({
        query: (food_id) => ({
          url: `/foods/${food_id}`,
          method: "DELETE",
          headers: {
            Accept: "application/json",
          },
        }),
      }),
      getFoodById: builder.query<any[], number>({
        query: (food_id) => ({
          url: `/foods/${food_id}`,
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }),
      }),
      getFoodList: builder.query<any[], number>({
        query: (org_id) => ({
          url: `/foods/list/${org_id}`,
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }),
      }),
      
    };
  },
});

export const {
  useGetFoodsQuery,
} = Foods;
