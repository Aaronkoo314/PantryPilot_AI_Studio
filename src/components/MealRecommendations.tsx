import React, { useMemo } from 'react';
import {
  Clock,
  Flame,
  CheckCircle,
  AlertCircle,
  ArrowUpDown,
  Filter,
  ChevronRight,
  SlidersHorizontal,
  Edit3,
  Sparkles,
} from 'lucide-react';
import {
  Meal,
  MealPreference,
  MealTimeOption,
  RecommendationFilterState,
  SortOption,
  UserSetupState,
} from '../types';
import { INVENTED_MEALS } from '../data';
import { filterAndSortMeals } from '../utils/mealMatcher';

interface MealRecommendationsProps {
  setupState: UserSetupState;
  filterState: RecommendationFilterState;
  onUpdateFilters: (updated: Partial<RecommendationFilterState>) => void;
  onSelectMeal: (meal: Meal) => void;
  onBackToSetup: () => void;
}

export function MealRecommendations({
  setupState,
  filterState,
  onUpdateFilters,
  onSelectMeal,
  onBackToSetup,
}: MealRecommendationsProps) {
  // Compute matching and filtered meals
  const mealResults = useMemo(() => {
    return filterAndSortMeals(
      INVENTED_MEALS,
      setupState.selectedIngredientIds,
      setupState.timePreference,
      setupState.mealPreference,
      filterState
    );
  }, [setupState, filterState]);

  // Count how many total meals have 100% ingredient match
  const fullyMatchedCount = useMemo(() => {
    return filterAndSortMeals(
      INVENTED_MEALS,
      setupState.selectedIngredientIds,
      setupState.timePreference,
      setupState.mealPreference,
      { ...filterState, onlyNoMissing: true }
    ).length;
  }, [setupState, filterState]);

  return (
    <div className="space-y-6 pb-24">
      {/* Header & Context summary */}
      <div className="bg-white p-5 sm:p-7 rounded-3xl border border-[#E5E2D9] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#4A6D4B] mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#4A6D4B]" />
            <span>Step 2: Curated Meal Recommendations</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#242320] tracking-tight">
            Recommended Meals For You
          </h1>
          <p className="text-xs sm:text-sm text-[#7A7870] mt-1">
            Ranked based on your {setupState.selectedIngredientIds.length} on-hand ingredients,{' '}
            {setupState.peopleCount} {setupState.peopleCount === 1 ? 'person' : 'people'}, and{' '}
            {setupState.mealPreference} preference.
          </p>
        </div>

        {/* Back / Edit Setup Button */}
        <button
          id="recommendations-edit-setup-btn"
          type="button"
          onClick={onBackToSetup}
          className="self-start md:self-center flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold text-[#242320] bg-[#F5F2EA] hover:bg-[#EAE6DC] transition-colors border border-[#E5E2D9] shrink-0 cursor-pointer"
        >
          <Edit3 className="w-4 h-4 text-[#7A7870]" />
          <span>Edit Pantry & Criteria</span>
        </button>
      </div>

      {/* FILTER & SORT CONTROLS BAR */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#E5E2D9] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-[#E5E2D9]">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#4A6D4B]" />
            <span className="text-sm font-bold text-[#242320]">Filter & Sort</span>
            <span className="text-xs text-[#7A7870] font-medium">
              ({mealResults.length} meals available)
            </span>
          </div>

          {/* Quick toggle: Only 100% on-hand meals */}
          <label className="flex items-center gap-2 cursor-pointer select-none text-xs sm:text-sm font-medium text-[#242320]">
            <input
              id="filter-only-no-missing"
              type="checkbox"
              checked={filterState.onlyNoMissing}
              onChange={(e) => onUpdateFilters({ onlyNoMissing: e.target.checked })}
              className="w-4 h-4 text-[#4A6D4B] rounded border-[#E5E2D9] focus:ring-[#4A6D4B] cursor-pointer"
            />
            <span className="flex items-center gap-1.5">
              <span>Show only 100% ready (no missing items)</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#EBF1EC] text-[#34603B] font-bold">
                {fullyMatchedCount}
              </span>
            </span>
          </label>
        </div>

        {/* Sort and Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs sm:text-sm">
          {/* Sort By Dropdown */}
          <div className="space-y-1.5">
            <label htmlFor="sort-by-select" className="text-xs font-semibold text-[#7A7870] flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#7A7870]" />
              Sort By
            </label>
            <select
              id="sort-by-select"
              value={filterState.sortBy}
              onChange={(e) => onUpdateFilters({ sortBy: e.target.value as SortOption })}
              className="w-full p-2.5 bg-[#FDFCF9] border border-[#E5E2D9] rounded-2xl text-[#242320] font-medium focus:outline-none focus:ring-2 focus:ring-[#4A6D4B]/30 focus:border-[#4A6D4B] cursor-pointer"
            >
              <option value="match">Highest Ingredient Match %</option>
              <option value="time">Fastest Cooking Time</option>
              <option value="calories_asc">Calories (Lowest first)</option>
              <option value="calories_desc">Calories (Highest first)</option>
            </select>
          </div>

          {/* Cooking Time Filter */}
          <div className="space-y-1.5">
            <label htmlFor="filter-cooking-time" className="text-xs font-semibold text-[#7A7870] flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#7A7870]" />
              Max Cooking Time
            </label>
            <select
              id="filter-cooking-time"
              value={filterState.maxTimeFilter}
              onChange={(e) =>
                onUpdateFilters({
                  maxTimeFilter: e.target.value as 'all' | MealTimeOption,
                })
              }
              className="w-full p-2.5 bg-[#FDFCF9] border border-[#E5E2D9] rounded-2xl text-[#242320] font-medium focus:outline-none focus:ring-2 focus:ring-[#4A6D4B]/30 focus:border-[#4A6D4B] cursor-pointer"
            >
              <option value="all">Any Cooking Time</option>
              <option value="15">Quick (≤ 15 minutes)</option>
              <option value="30">Medium (≤ 30 minutes)</option>
              <option value="60">Extended (≤ 60 minutes)</option>
            </select>
          </div>

          {/* Meal Preference Filter */}
          <div className="space-y-1.5">
            <label htmlFor="filter-meal-preference" className="text-xs font-semibold text-[#7A7870] flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#7A7870]" />
              Meal Preference
            </label>
            <select
              id="filter-meal-preference"
              value={filterState.preferenceFilter}
              onChange={(e) =>
                onUpdateFilters({
                  preferenceFilter: e.target.value as 'all' | MealPreference,
                })
              }
              className="w-full p-2.5 bg-[#FDFCF9] border border-[#E5E2D9] rounded-2xl text-[#242320] font-medium focus:outline-none focus:ring-2 focus:ring-[#4A6D4B]/30 focus:border-[#4A6D4B] cursor-pointer"
            >
              <option value="all">All Meal Categories</option>
              <option value="Regular">Regular</option>
              <option value="Quick & Easy">Quick & Easy</option>
              <option value="Fitness">Fitness (High Protein)</option>
              <option value="Family Meal">Family Meal</option>
            </select>
          </div>
        </div>
      </div>

      {/* MEALS LIST GRID */}
      {mealResults.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {mealResults.map(({ meal, matchPercentage, missingIngredients }) => {
            const hasAllIngredients = missingIngredients.length === 0;

            return (
              <div
                key={meal.id}
                id={`meal-card-${meal.id}`}
                className="bg-white rounded-3xl border border-[#E5E2D9] overflow-hidden shadow-xs hover:shadow-md hover:border-[#4A6D4B]/60 transition-all flex flex-col justify-between"
              >
                {/* Top header bar on card */}
                <div className="p-5 sm:p-6 space-y-3.5">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Ingredient Match Badge */}
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                          hasAllIngredients
                            ? 'bg-[#EBF1EC] text-[#34603B] border border-[#CDE0D0]'
                            : matchPercentage >= 60
                            ? 'bg-[#FDF1ED] text-[#B85737] border border-[#F5D8CE]'
                            : 'bg-[#F5F2EA] text-[#242320] border border-[#E5E2D9]'
                        }`}
                      >
                        {hasAllIngredients ? (
                          <CheckCircle className="w-3.5 h-3.5 text-[#34603B]" />
                        ) : (
                          <AlertCircle className="w-3.5 h-3.5 text-[#B85737]" />
                        )}
                        {hasAllIngredients ? '100% Ready To Cook' : `${matchPercentage}% Match`}
                      </span>

                      {/* Meal Category */}
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#F5F2EA] text-[#7A7870]">
                        {meal.category}
                      </span>

                      {/* Difficulty */}
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#FDFCF9] border border-[#E5E2D9] text-[#7A7870]">
                        {meal.difficulty}
                      </span>
                    </div>

                    {/* Emoji visual */}
                    <span className="text-2xl" role="img" aria-label={meal.name}>
                      {meal.emoji}
                    </span>
                  </div>

                  {/* Meal title & description */}
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-[#242320] leading-tight hover:text-[#4A6D4B] transition-colors">
                      {meal.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#7A7870] mt-1 leading-relaxed line-clamp-2">
                      {meal.shortDescription}
                    </p>
                  </div>

                  {/* Core Metrics Grid */}
                  <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-[#F5F2EA] rounded-2xl text-center border border-[#E5E2D9] text-xs">
                    <div>
                      <div className="flex items-center justify-center gap-1 text-[#7A7870] mb-0.5">
                        <Clock className="w-3.5 h-3.5 text-[#7A7870]" />
                        <span>Cook Time</span>
                      </div>
                      <span className="font-extrabold text-[#242320] text-sm">
                        {meal.cookingTimeMinutes}m
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center justify-center gap-1 text-[#7A7870] mb-0.5">
                        <Flame className="w-3.5 h-3.5 text-[#D97757]" />
                        <span>Calories</span>
                      </div>
                      <span className="font-extrabold text-[#242320] text-sm">
                        {meal.caloriesPerServing}{' '}
                        <span className="text-[10px] font-normal text-[#7A7870]">/person</span>
                      </span>
                    </div>

                    <div>
                      <div className="text-[#7A7870] mb-0.5">Protein</div>
                      <span className="font-extrabold text-[#4A6D4B] text-sm">
                        {meal.protein}g{' '}
                        <span className="text-[10px] font-normal text-[#7A7870]">/person</span>
                      </span>
                    </div>
                  </div>

                  {/* Missing Ingredients Status */}
                  <div className="text-xs pt-1">
                    {hasAllIngredients ? (
                      <div className="flex items-center gap-1.5 text-[#34603B] font-semibold bg-[#EBF1EC] px-3.5 py-2.5 rounded-2xl border border-[#CDE0D0]">
                        <CheckCircle className="w-4 h-4 shrink-0" />
                        <span>You have all {meal.ingredients.length} ingredients ready in your kitchen!</span>
                      </div>
                    ) : (
                      <div className="bg-[#FDF1ED] border border-[#F5D8CE] p-3 rounded-2xl space-y-1">
                        <div className="flex items-center justify-between text-[#B85737] font-semibold">
                          <span className="flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 text-[#B85737]" />
                            <span>Missing {missingIngredients.length} item{missingIngredients.length > 1 ? 's' : ''}:</span>
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {missingIngredients.map((item) => (
                            <span
                              key={item.ingredientId}
                              className="px-2 py-0.5 bg-white border border-[#F5D8CE] text-[#B85737] rounded-lg text-[11px] font-medium shadow-2xs"
                            >
                              + {item.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card CTA */}
                <div className="p-4 bg-[#FDFCF9] border-t border-[#E5E2D9] flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#7A7870]">
                    Base: {meal.baseServings} portions (scales to {setupState.peopleCount})
                  </span>
                  <button
                    id={`view-meal-btn-${meal.id}`}
                    type="button"
                    onClick={() => onSelectMeal(meal)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#4A6D4B] hover:bg-[#3B583C] text-white text-xs sm:text-sm font-bold rounded-2xl transition-all shadow-xs cursor-pointer active:scale-95"
                  >
                    <span>View Recipe</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#E5E2D9] text-center space-y-4 max-w-lg mx-auto shadow-xs">
          <div className="w-16 h-16 bg-[#EBF1EC] text-[#4A6D4B] rounded-full flex items-center justify-center mx-auto text-2xl">
            🥣
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#242320]">No Meals Found For Current Filter</h3>
            <p className="text-xs sm:text-sm text-[#7A7870] mt-1 leading-relaxed">
              None of our invented recipes match all of your strict criteria (like "only 100% on-hand" or specific time limits).
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              id="reset-filters-btn"
              type="button"
              onClick={() =>
                onUpdateFilters({
                  onlyNoMissing: false,
                  maxTimeFilter: 'all',
                  preferenceFilter: 'all',
                  sortBy: 'match',
                })
              }
              className="px-4 py-2.5 bg-[#4A6D4B] hover:bg-[#3B583C] text-white rounded-2xl text-xs font-bold transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
            <button
              id="empty-state-edit-setup-btn"
              type="button"
              onClick={onBackToSetup}
              className="px-4 py-2.5 bg-[#F5F2EA] hover:bg-[#EAE6DC] text-[#242320] border border-[#E5E2D9] rounded-2xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Add More Ingredients
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
