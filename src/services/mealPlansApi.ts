import { mealPlanDataType, mealPlanTableType } from "@/app/types";
import { apiSlice } from "@/features/api/apiSlice";

interface mealPlansInput {
    query: string,
    org_id: number
}

export const MealPlans = apiSlice.injectEndpoints({
    endpoints(builder) {
        return {
            getMealPlans: builder.query<mealPlanTableType, mealPlansInput>({
                query: (searchCretiria) => ({
                    url: `/meal_plans?org_id=${searchCretiria.org_id}&${searchCretiria.query}`,
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                    },
                    providesTags: ["MealPlans"],
                }),
            }),
            createMealPlans: builder.query<any, mealPlanDataType>({
                query: (fooddata) => ({
                    url: `/meal_plans`,
                    method: "POST",
                    body: fooddata,
                    headers: {
                        Accept: "application/json",
                    },
                    invalidatesTags: ["MealPlans"],

                }),
            }),
            updateMealPlans: builder.query<any, mealPlanDataType & { id: number }>({
                query: (fooddata) => ({
                    url: `/meal_plans`,
                    method: "PUT",
                    body: fooddata,
                    headers: {
                        Accept: "application/json",
                    },
                    invalidatesTags: ["MealPlans"],

                }),
            }),
            deleteMealPlans: builder.query<any[], number>({
                query: (meal_plan_id) => ({
                    url: `/meal_plans/${meal_plan_id}`,
                    method: "DELETE",
                    headers: {
                        Accept: "application/json",
                    },
                    invalidatesTags: ["MealPlans"],

                }),
            }),
            getMealPlanById: builder.query<any[], number>({
                query: (meal_plan_id) => ({
                    url: `/meal_plans/${meal_plan_id}`,
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                    },
                    providesTags: ["MealPlans"],

                }),
            }),
            getMealPlansList: builder.query<any[], number>({
                query: (org_id) => ({
                    url: `/meal_plans/list/${org_id}`,
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                    },
                    providesTags: ["MealPlans"],

                }),
            }),

        };
    },
});

export const {
    useGetMealPlansQuery,
    useCreateMealPlansQuery,
    useUpdateMealPlansQuery,
    useDeleteMealPlansQuery,
    useGetMealPlanByIdQuery,
    useGetMealPlansListQuery,
} = MealPlans;
