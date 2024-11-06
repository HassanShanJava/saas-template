export interface FoodsInput {
    query: string;
    org_id: number;
}

export interface FoodTableResponse {
    data: CreateFoodTypes[];
    total_counts: number;
    filtered_counts: number;
  }
  export interface CreateFoodTypes {
    id?: number;
    org_id?: number;
    name: string;
    brand: string;
    category: string;
    description?: string;
    other_name?: string;
    visible_for?: string;
    total_nutrition: number | null;
    kcal: number | null;
    protein: number | null;
    fat: number | null;
    carbohydrates: number | null;
    carbs_sugar?: number | null;
    carbs_saturated?: number | null;
    kilojoules?: number | null;
    fiber?: number | null;
    calcium?: number | null;
    iron?: number | null;
    magnesium?: number | null;
    phosphorus?: number | null;
    potassium?: number | null;
    sodium?: number | null;
    zinc?: number | null;
    copper?: number | null;
    selenium?: number | null;
    vitamin_a?: number | null;
    vitamin_b1?: number | null;
    vitamin_b2?: number | null;
    vitamin_b6?: number | null;
    vitamin_b12?: number | null;
    vitamin_c?: number | null;
    vitamin_d?: number | null;
    vitamin_e?: number | null;
    folic_acid?: number | null;
    fat_unsaturated?: number | null;
    cholesterol?: number | null;
    alcohol?: number | null;
    alchohol_mono?: number | null;
    alchohol_poly?: number | null;
    trans_fat?: number | null;
    weight: number | null;
    weight_unit: string | undefined;
    img_url?: string | null;
    created_at?: Date;
    created_by?: number;
    is_deleted?: boolean;
    is_validated?: boolean;
  }
