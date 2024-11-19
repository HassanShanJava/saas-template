import { MealPlanDataType, MealPlanTableType, MealPlansInput } from "@/app/types/meal_plan";
import { apiSlice } from "@/features/api/apiSlice";

export const MealPlans = apiSlice.injectEndpoints({
  endpoints(builder) {
    return {
      getMealPlans: builder.query<MealPlanTableType, MealPlansInput>({
        query: (searchCretiria) => ({
          url: `/meal_plans?org_id=${searchCretiria.org_id}&${searchCretiria.query}`,
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }),
        providesTags: ["MealPlans"],
      }),
      createMealPlans: builder.mutation<any, MealPlanDataType>({
        query: (mealdata) => ({
          url: `/meal_plans`,
          method: "POST",
          body: mealdata,
          headers: {
            Accept: "application/json",
          },
        }),
        invalidatesTags: ["MealPlans"],
      }),
      updateMealPlans: builder.mutation<any, MealPlanDataType>(
        {
          query: (mealdata) => ({
            url: `/meal_plans`,
            method: "PUT",
            body: mealdata,
            headers: {
              Accept: "application/json",
            },
          }),
          invalidatesTags: ["MealPlans"],
        }
      ),
      deleteMealPlans: builder.mutation<any, number>({
        query: (meal_plan_id) => ({
          url: `/meal_plans/${meal_plan_id}`,
          method: "DELETE",
          headers: {
            Accept: "application/json",
          },
        }),
        invalidatesTags: ["MealPlans"],
      }),
      getMealPlanById: builder.query<MealPlanDataType, number>({
        query: (meal_plan_id) => ({
          url: `/meal_plans/${meal_plan_id}`,
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }),
        providesTags: ["MealPlans"],
      }),
      getMealPlansList: builder.query<{id:number, name:string}[], number>({
        query: (org_id) => ({
          url: `/meal_plans/list/${org_id}`,
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }),
        providesTags: ["MealPlans"],
      }),
    };
  },
});

export const {
  useGetMealPlansQuery,
  useCreateMealPlansMutation,
  useUpdateMealPlansMutation,
  useDeleteMealPlansMutation,
  useGetMealPlanByIdQuery,
  useGetMealPlansListQuery,
} = MealPlans;
