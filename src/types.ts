export type IngredientCategory =
  | 'Proteins'
  | 'Vegetables'
  | 'Grains & Carbs'
  | 'Dairy & Eggs'
  | 'Pantry & Seasonings';

export interface Ingredient {
  id: string;
  name: string;
  category: IngredientCategory;
  emoji: string;
  commonUnit: string;
  suggestedPantry?: boolean;
}

export type MealDifficulty = 'Easy' | 'Medium' | 'Hard';

export type MealCategory = 'Regular' | 'Quick & Easy' | 'Fitness' | 'Family Meal';

export type MealPreference = 'Regular' | 'Quick & Easy' | 'Fitness' | 'Family Meal';

export type MealTimeOption = '15' | '30' | '60';

export interface MealIngredient {
  ingredientId: string;
  name: string;
  amount: number;
  unit: string;
}

export interface Meal {
  id: string;
  name: string;
  shortDescription: string;
  category: MealCategory;
  difficulty: MealDifficulty;
  baseServings: number;
  prepTimeMinutes: number;
  cookingTimeMinutes: number;
  totalTimeMinutes: number;
  caloriesPerServing: number;
  protein: number; // grams per serving
  carbohydrates: number; // grams per serving
  fat: number; // grams per serving
  fitnessSuitability: boolean;
  ingredients: MealIngredient[];
  instructions: string[];
  tags: string[];
  emoji: string;
  chefTip?: string;
}

export interface UserSetupState {
  selectedIngredientIds: string[];
  peopleCount: number;
  timePreference: MealTimeOption;
  mealPreference: MealPreference;
}

export type ActiveScreen = 'setup' | 'recommendations' | 'detail';

export type SortOption = 'match' | 'time' | 'calories_asc' | 'calories_desc';

export interface RecommendationFilterState {
  sortBy: SortOption;
  maxTimeFilter: 'all' | '15' | '30' | '60';
  preferenceFilter: 'all' | MealPreference;
  onlyNoMissing: boolean;
}

export interface MealMatchResult {
  meal: Meal;
  matchPercentage: number;
  matchingIngredients: MealIngredient[];
  missingIngredients: MealIngredient[];
  isTimeFit: boolean;
  isPreferenceFit: boolean;
}
