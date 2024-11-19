
export interface MealPlansInput {
    query: string;
    org_id: number;
}

export interface MealPlanTableType {
    data: MealPlanDataType[];
    total_counts: number;
    filtered_counts: number;
}

export interface MealPlanDataType {
    id?: number;
    meal_plan_id?: number;
    org_id?: number;
    visible_for?: string;
    carbs?: number | null;
    protein?: number | null;
    fats?: number | null;
    name?: string;
    profile_img?: string | null;
    description?: string;
    member_id?: number[];
    meals?: {
        meal_time: string;
        food_id: number;
        quantity: number;
    }[];
}
