export const categories = [
    { value: "baked_products", label: "Baked Products" },
    { value: "beverages", label: "Beverages" },
    { value: "cheese_eggs", label: "Cheese Milk and Eggs Products" },
    { value: "cooked_meals", label: "Cooked Meals" },
    { value: "fish_products", label: "Fish Products" },
    { value: "fruits_vegs", label: "Fruits and Vegetables" },
    { value: "herbs_spices", label: "Herbs and Spices" },
    { value: "meat_products", label: "Meat Products" },
    { value: "nuts_seeds_snacks", label: "Nuts Seeds and Snacks" },
    { value: "pasta_cereals", label: "Pasta and Breakfast Cereals" },
    { value: "restaurant_meals", label: "Restaurant Meals" },
    { value: "soups_sauces", label: "Soups, Sauces, fats and oil" },
    { value: "sweets_candy", label: "Sweets and Candy" },
    { value: "other", label: "Other" },
  ];
  
  export const visibleFor = [
    { value: "only_me", label: "Only me" },
    { value: "members", label: "Members in my gym" },
    { value: "coaches_and_staff", label: "Coaches and Staff in my gym" },
    { value: "everyone", label: "Everyone in my gym" },
  ];
  
  export const weights = [
    { value: "g", label: "Gram" },
    { value: "ml", label: "ML" },
    { value: "g_ml", label: "Gram/ML" },
  ];



//   form info

export const basicInfo = [
    {
      type: "text",
      name: "name",
      label: "Name*",
      required: true,
    },
    {
      type: "text",
      name: "brand",
      label: "Brand",
      required: false,
    },
    {
      type: "select",
      label: "Category",
      name: "category",
      required: true,
      options: categories,
    },
    {
      type: "text",
      label: "Description",
      name: "description",
      required: false,
    },
    {
      type: "text",
      label: "Other Name",
      name: "other_name",
      required: false,
    },
    {
      type: "select",
      name: "visible_for",
      label: "Visible For",
      required: false,
      options: visibleFor,
    },
  ];
  
  export const nutrientsInfo = [
    {
      name: "total_nutrition",
      type: "number",
      label: "Total Nutrition (g)",
      required: true,
    },
    {
      name: "kcal",
      type: "number",
      label: "Kcal",
      required: true,
    },
    {
      name: "protein",
      type: "number",
      label: "Protein (g)",
      required: true,
    },
    {
      name: "fat",
      type: "number",
      label: "Total Fat (g)",
      required: true,
    },
    {
      name: "carbohydrates",
      type: "number",
      label: "Carbohydrates (g)",
      required: true,
    },
    {
      name: "carbs_sugar",
      type: "number",
      label: "Of which sugars (g)",
      required: false,
    },
    {
      name: "carbs_saturated",
      type: "number",
      label: "Of which saturated (g)",
      required: false,
    },
    {
      name: "kilojoules",
      type: "number",
      label: "Kilojoules (Kj)",
      required: false,
    },
    {
      name: "fiber",
      type: "number",
      label: "Fiber (g)",
      required: false,
    },
    {
      name: "calcium",
      type: "number",
      label: "Calcium (mg)",
      required: false,
    },
    {
      name: "iron",
      type: "number",
      label: "Iron (mg)",
      required: false,
    },
    {
      name: "magnesium",
      type: "number",
      label: "Magnesium (mg)",
      required: false,
    },
    {
      name: "phosphorus",
      type: "number",
      label: "Phosphorus (mg)",
      required: false,
    },
    {
      name: "potassium",
      type: "number",
      label: "Potassium (mg)",
      required: false,
    },
    {
      name: "sodium",
      type: "number",
      label: "Sodium (mg)",
      required: false,
    },
    {
      name: "zinc",
      type: "number",
      label: "Zinc (mg)",
      required: false,
    },
    {
      name: "copper",
      type: "number",
      label: "Copper (mg)",
      required: false,
    },
    {
      name: "selenium",
      type: "number",
      label: "Selenium (mg)",
      required: false,
    },
    {
      name: "vitamin_c",
      type: "number",
      label: "Vitamin C (mg)",
      required: false,
    },
    {
      name: "vitamin_b1",
      type: "number",
      label: "Vitamin B1 (mg)",
      required: false,
    },
    {
      name: "vitamin_b2",
      type: "number",
      label: "Vitamin B2 (mg)",
      required: false,
    },
    {
      name: "vitamin_b6",
      type: "number",
      label: "Vitamin B6 (mg)",
      required: false,
    },
    {
      name: "folic_acid",
      type: "number",
      label: "Folic Acid (mcg)",
      required: false,
    },
    {
      name: "vitamin_b12",
      type: "number",
      label: "Vitamin B12 (mcg)",
      required: false,
    },
    {
      name: "vitamin_a",
      type: "number",
      label: "Vitamin A (mcg)",
      required: false,
    },
    {
      name: "vitamin_e",
      type: "number",
      label: "Vitamin E (mg)",
      required: false,
    },
    {
      name: "vitamin_d",
      type: "number",
      label: "Vitamin D (mcg)",
      required: false,
    },
    {
      name: "fat_unsaturated",
      type: "number",
      label: "Fatty acid total unsaturated (g)",
      required: false,
    },
    {
      name: "cholesterol",
      type: "number",
      label: "Cholesterol (mg)",
      required: false,
    },
    {
      name: "alcohol",
      type: "number",
      label: "Alcohol (g)",
      required: false,
    },
    {
      name: "alchohol_mono",
      type: "number",
      label: "Of which mono unsaturated (g)",
      required: false,
    },
    {
      name: "alchohol_poly",
      type: "number",
      label: "Of which poly unsaturated (g)",
      required: false,
    },
    {
      name: "trans_fat",
      type: "number",
      label: "Trans fat (g)",
      required: false,
    },
    
  ];
  
  export const initialValue = {
    // basic
    name: "",
    brand: "",
    category: '',
    description: "",
    other_name: "",
    visible_for: '',
    // nutritions
    total_nutrition: null,
    kcal: null,
    protein: null,
    fat: null,
    carbohydrates: null,
    carbs_sugar: null,
    carbs_saturated: null,
    kilojoules: null,
    fiber: null,
    calcium: null,
    iron: null,
    magnesium: null,
    phosphorus: null,
    potassium: null,
    sodium: null,
    zinc: null,
    copper: null,
    selenium: null,
    vitamin_a: null,
    vitamin_b1: null,
    vitamin_b2: null,
    vitamin_b6: null,
    vitamin_b12: null,
    vitamin_c: null,
    vitamin_d: null,
    vitamin_e: null,
    folic_acid: null,
    fat_unsaturated: null,
    cholesterol: null,
    alcohol: null,
    alchohol_mono: null,
    alchohol_poly: null,
    trans_fat: null,
    weight: null,
    weight_unit: '',
  };