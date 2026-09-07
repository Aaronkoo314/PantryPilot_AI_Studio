import { Meal, MealIngredient, MealMatchResult, MealPreference, MealTimeOption, RecommendationFilterState } from '../types';

export function calculateMealMatch(meal: Meal, selectedIngredientIds: string[]): {
  matchPercentage: number;
  matchingIngredients: MealIngredient[];
  missingIngredients: MealIngredient[];
} {
  const selectedSet = new Set(selectedIngredientIds);
  const matchingIngredients: MealIngredient[] = [];
  const missingIngredients: MealIngredient[] = [];

  for (const item of meal.ingredients) {
    if (selectedSet.has(item.ingredientId)) {
      matchingIngredients.push(item);
    } else {
      missingIngredients.push(item);
    }
  }

  const matchPercentage = meal.ingredients.length > 0
    ? Math.round((matchingIngredients.length / meal.ingredients.length) * 100)
    : 0;

  return {
    matchPercentage,
    matchingIngredients,
    missingIngredients,
  };
}

export function evaluateMealFitness(meal: Meal, preference: MealPreference, timePref: MealTimeOption): {
  isTimeFit: boolean;
  isPreferenceFit: boolean;
} {
  // Time fit evaluation:
  // '15' -> cooking time <= 15 min
  // '30' -> cooking time <= 30 min
  // '60' -> up to 60+ min (matches all)
  const maxTime = timePref === '15' ? 15 : timePref === '30' ? 30 : 999;
  const isTimeFit = meal.cookingTimeMinutes <= maxTime;

  // Preference fit evaluation:
  let isPreferenceFit = true;
  if (preference === 'Quick & Easy') {
    isPreferenceFit = meal.category === 'Quick & Easy' || meal.cookingTimeMinutes <= 15;
  } else if (preference === 'Fitness') {
    // Fitness option prioritizes meals relatively higher in protein, lower in calories, nutritionally balanced
    isPreferenceFit = meal.fitnessSuitability;
  } else if (preference === 'Family Meal') {
    isPreferenceFit = meal.category === 'Family Meal' || meal.baseServings >= 3;
  }

  return { isTimeFit, isPreferenceFit };
}

export function filterAndSortMeals(
  meals: Meal[],
  selectedIngredientIds: string[],
  userTimePref: MealTimeOption,
  userPreference: MealPreference,
  filters: RecommendationFilterState
): MealMatchResult[] {
  // 1. Calculate matches
  const matchResults: MealMatchResult[] = meals.map((meal) => {
    const { matchPercentage, matchingIngredients, missingIngredients } = calculateMealMatch(meal, selectedIngredientIds);
    const { isTimeFit, isPreferenceFit } = evaluateMealFitness(meal, userPreference, userTimePref);
    return {
      meal,
      matchPercentage,
      matchingIngredients,
      missingIngredients,
      isTimeFit,
      isPreferenceFit,
    };
  });

  // 2. Filter by "only no missing ingredients"
  let filtered = matchResults;
  if (filters.onlyNoMissing) {
    filtered = filtered.filter((r) => r.missingIngredients.length === 0);
  }

  // 3. Filter by max cooking time (if user chooses specific filter tab)
  if (filters.maxTimeFilter !== 'all') {
    const limit = parseInt(filters.maxTimeFilter, 10);
    filtered = filtered.filter((r) => r.meal.cookingTimeMinutes <= limit);
  }

  // 4. Filter by meal preference
  if (filters.preferenceFilter !== 'all') {
    const pref = filters.preferenceFilter;
    filtered = filtered.filter((r) => {
      if (pref === 'Fitness') return r.meal.fitnessSuitability;
      if (pref === 'Quick & Easy') return r.meal.category === 'Quick & Easy' || r.meal.cookingTimeMinutes <= 15;
      if (pref === 'Family Meal') return r.meal.category === 'Family Meal' || r.meal.baseServings >= 3;
      return true;
    });
  }

  // 5. Sorting
  return filtered.sort((a, b) => {
    if (filters.sortBy === 'match') {
      // Primary: match percentage descending.
      if (b.matchPercentage !== a.matchPercentage) {
        return b.matchPercentage - a.matchPercentage;
      }
      // Secondary: cooking time ascending
      return a.meal.cookingTimeMinutes - b.meal.cookingTimeMinutes;
    }
    if (filters.sortBy === 'time') {
      return a.meal.cookingTimeMinutes - b.meal.cookingTimeMinutes;
    }
    if (filters.sortBy === 'calories_asc') {
      return a.meal.caloriesPerServing - b.meal.caloriesPerServing;
    }
    if (filters.sortBy === 'calories_desc') {
      return b.meal.caloriesPerServing - a.meal.caloriesPerServing;
    }
    return 0;
  });
}
