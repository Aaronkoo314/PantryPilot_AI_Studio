import { useState } from 'react';
import {
  ArrowLeft,
  Clock,
  Flame,
  Check,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ChefHat,
  Scale,
  RotateCcw,
  Users,
} from 'lucide-react';
import { Meal, UserSetupState } from '../types';

interface MealDetailProps {
  meal: Meal;
  setupState: UserSetupState;
  onBackToRecommendations: () => void;
  onBackToSetup: () => void;
}

export function MealDetail({
  meal,
  setupState,
  onBackToRecommendations,
  onBackToSetup,
}: MealDetailProps) {
  // Initialize serving size to the number of people chosen in Meal Setup
  const [currentServings, setCurrentServings] = useState<number>(setupState.peopleCount || meal.baseServings);

  // Track checked steps for interactive cooking guidance
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const toggleStep = (index: number) => {
    setCompletedSteps((prev) =>
      prev.includes(index) ? prev.filter((s) => s !== index) : [...prev, index]
    );
  };

  // Proportional scale factor based on base servings
  const scaleRatio = currentServings / meal.baseServings;

  // Total calories dynamically scale with portions, while calories per person remains constant
  const totalCalories = Math.round(meal.caloriesPerServing * currentServings);

  // Helper to format scaled ingredient amounts neatly
  const formatAmount = (baseAmount: number): string => {
    const scaled = baseAmount * scaleRatio;
    if (scaled % 1 === 0) return scaled.toString();
    if (Math.abs(scaled - Math.round(scaled)) < 0.05) return Math.round(scaled).toString();
    return Number(scaled.toFixed(1)).toString();
  };

  const selectedSet = new Set(setupState.selectedIngredientIds);

  return (
    <div className="space-y-6 pb-28">
      {/* Top Nav: Back buttons */}
      <div className="flex items-center justify-between gap-3">
        <button
          id="detail-back-recommendations-btn"
          type="button"
          onClick={onBackToRecommendations}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold bg-white border border-[#E5E2D9] text-[#242320] hover:bg-[#F5F2EA] transition-colors shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Recommendations</span>
        </button>

        <button
          id="detail-back-setup-btn"
          type="button"
          onClick={onBackToSetup}
          className="text-xs text-[#7A7870] hover:text-[#4A6D4B] font-semibold underline cursor-pointer"
        >
          Change Inventory/Setup
        </button>
      </div>

      {/* Hero Meal Header Card */}
      <div className="bg-white rounded-3xl border border-[#E5E2D9] overflow-hidden shadow-xs">
        <div className="p-6 sm:p-8 bg-[#F5F2EA] border-b border-[#E5E2D9] space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#4A6D4B]/10 text-[#4A6D4B] border border-[#4A6D4B]/20">
                  {meal.category}
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-white text-[#7A7870] border border-[#E5E2D9]">
                  Difficulty: {meal.difficulty}
                </span>
                {meal.fitnessSuitability && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#EBF1EC] text-[#34603B] border border-[#CDE0D0] flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#34603B]" />
                    Fitness Choice (High Protein)
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#242320] tracking-tight">
                {meal.name}
              </h1>
              <p className="text-sm sm:text-base text-[#7A7870] max-w-2xl leading-relaxed">
                {meal.shortDescription}
              </p>
            </div>

            <div className="text-5xl sm:text-6xl p-3.5 bg-white rounded-2xl border border-[#E5E2D9] shadow-xs shrink-0 select-none">
              {meal.emoji}
            </div>
          </div>

          {/* Time Breakdown Cards */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-2">
            <div className="bg-white p-3.5 rounded-2xl border border-[#E5E2D9] text-center">
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-[#7A7870]">
                Prep Time
              </span>
              <span className="text-base sm:text-lg font-extrabold text-[#242320]">
                {meal.prepTimeMinutes} mins
              </span>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-[#E5E2D9] text-center">
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-[#7A7870]">
                Cook Time
              </span>
              <span className="text-base sm:text-lg font-extrabold text-[#D97757]">
                {meal.cookingTimeMinutes} mins
              </span>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-[#E5E2D9] text-center">
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-[#7A7870]">
                Total Time
              </span>
              <span className="text-base sm:text-lg font-extrabold text-[#4A6D4B]">
                {meal.totalTimeMinutes} mins
              </span>
            </div>
          </div>
        </div>

        {/* Serving Size Controller Bar */}
        <div className="p-5 sm:p-6 bg-[#FDFCF9] border-b border-[#E5E2D9] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-[#242320] flex items-center gap-2">
              <Users className="w-4 h-4 text-[#4A6D4B]" />
              <span>Serving Size Control</span>
            </h2>
            <p className="text-xs text-[#7A7870] mt-0.5">
              Adjust portions — ingredient quantities and total recipe calories will update instantly.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Stepper */}
            <div className="flex items-center border border-[#E5E2D9] rounded-2xl bg-[#F5F2EA] p-1 shadow-2xs">
              <button
                id="serving-decrement-btn"
                type="button"
                onClick={() => setCurrentServings((prev) => Math.max(1, prev - 1))}
                className="w-10 h-10 rounded-xl bg-white hover:bg-[#FDFCF9] active:scale-95 text-[#242320] font-bold border border-[#E5E2D9] flex items-center justify-center transition-all text-base cursor-pointer"
                aria-label="Decrease serving size"
              >
                -
              </button>
              <div className="w-20 text-center">
                <span className="text-xl font-extrabold text-[#242320] leading-none">
                  {currentServings}
                </span>
                <span className="block text-[10px] uppercase font-bold text-[#7A7870] tracking-wider">
                  {currentServings === 1 ? 'serving' : 'servings'}
                </span>
              </div>
              <button
                id="serving-increment-btn"
                type="button"
                onClick={() => setCurrentServings((prev) => Math.min(12, prev + 1))}
                className="w-10 h-10 rounded-xl bg-white hover:bg-[#FDFCF9] active:scale-95 text-[#242320] font-bold border border-[#E5E2D9] flex items-center justify-center transition-all text-base cursor-pointer"
                aria-label="Increase serving size"
              >
                +
              </button>
            </div>

            {/* Reset to initial portion */}
            {currentServings !== meal.baseServings && (
              <button
                id="reset-servings-btn"
                type="button"
                onClick={() => setCurrentServings(meal.baseServings)}
                className="px-2.5 py-1.5 text-[#7A7870] hover:text-[#242320] hover:bg-[#F5F2EA] border border-[#E5E2D9] rounded-xl transition-colors text-xs flex items-center gap-1 cursor-pointer font-medium"
                title={`Reset to recipe default (${meal.baseServings})`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Default ({meal.baseServings})</span>
              </button>
            )}
          </div>
        </div>

        {/* Nutrition Breakdown Grid */}
        <div className="p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#7A7870] flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-[#7A7870]" />
              <span>Nutrition & Energy Breakdown</span>
            </h2>
            <span className="text-xs text-[#7A7870] font-medium">
              Based on {currentServings} {currentServings === 1 ? 'serving' : 'servings'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {/* Calories per person (CONSTANT) */}
            <div className="bg-[#FDF1ED] border border-[#F5D8CE] p-3.5 rounded-2xl text-center">
              <span className="block text-[11px] font-bold text-[#B85737] uppercase tracking-tight">
                Calories / Person
              </span>
              <span className="text-xl sm:text-2xl font-black text-[#B85737] block mt-0.5">
                {meal.caloriesPerServing}
              </span>
              <span className="text-[10px] text-[#7A7870] font-medium">Per portion</span>
            </div>

            {/* Total Calories (SCALED) */}
            <div className="bg-[#4A6D4B] text-white p-3.5 rounded-2xl text-center shadow-xs">
              <span className="block text-[11px] font-bold text-white/80 uppercase tracking-tight">
                Total Calories
              </span>
              <span className="text-xl sm:text-2xl font-black text-white block mt-0.5">
                {totalCalories}
              </span>
              <span className="text-[10px] text-white/70 font-medium">Entire batch ({currentServings}p)</span>
            </div>

            {/* Protein per serving */}
            <div className="bg-[#F5F2EA] border border-[#E5E2D9] p-3.5 rounded-2xl text-center">
              <span className="block text-[11px] font-bold text-[#7A7870] uppercase tracking-tight">
                Protein
              </span>
              <span className="text-xl font-extrabold text-[#34603B] block mt-0.5">
                {meal.protein}g
              </span>
              <span className="text-[10px] text-[#7A7870]">per person</span>
            </div>

            {/* Carbs per serving */}
            <div className="bg-[#F5F2EA] border border-[#E5E2D9] p-3.5 rounded-2xl text-center">
              <span className="block text-[11px] font-bold text-[#7A7870] uppercase tracking-tight">
                Carbohydrates
              </span>
              <span className="text-xl font-extrabold text-[#242320] block mt-0.5">
                {meal.carbohydrates}g
              </span>
              <span className="text-[10px] text-[#7A7870]">per person</span>
            </div>

            {/* Fat per serving */}
            <div className="bg-[#F5F2EA] border border-[#E5E2D9] p-3.5 rounded-2xl text-center col-span-2 sm:col-span-1">
              <span className="block text-[11px] font-bold text-[#7A7870] uppercase tracking-tight">
                Fat
              </span>
              <span className="text-xl font-extrabold text-[#242320] block mt-0.5">
                {meal.fat}g
              </span>
              <span className="text-[10px] text-[#7A7870]">per person</span>
            </div>
          </div>

          <p className="text-[11px] text-[#7A7870] italic">
            * Note: Nutritional values are calculated estimates for everyday home cooking and are not intended as medical advice.
          </p>
        </div>
      </div>

      {/* TWO COLUMN SECTION: INGREDIENTS & INSTRUCTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: INGREDIENTS WITH PANTRY MATCH */}
        <section className="lg:col-span-5 bg-white p-5 sm:p-7 rounded-3xl border border-[#E5E2D9] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3.5 border-b border-[#E5E2D9]">
            <div>
              <h2 className="text-lg font-bold text-[#242320]">Ingredients Needed</h2>
              <p className="text-xs text-[#7A7870] mt-0.5">
                Quantities scaled for {currentServings} {currentServings === 1 ? 'serving' : 'servings'}.
              </p>
            </div>
          </div>

          <ul className="space-y-2.5">
            {meal.ingredients.map((item) => {
              const inPantry = selectedSet.has(item.ingredientId);
              const scaledQty = formatAmount(item.amount);

              return (
                <li
                  key={item.ingredientId}
                  id={`ingredient-row-${item.ingredientId}`}
                  className={`p-3 rounded-2xl border flex items-center justify-between gap-3 transition-colors ${
                    inPantry
                      ? 'bg-[#EBF1EC] border-[#CDE0D0] text-[#242320]'
                      : 'bg-[#FDF1ED] border-[#F5D8CE] text-[#242320]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs ${
                        inPantry
                          ? 'bg-[#4A6D4B] text-white'
                          : 'bg-[#D97757] text-white'
                      }`}
                    >
                      {inPantry ? (
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5 stroke-[2.5]" />
                      )}
                    </div>
                    <div>
                      <span className="text-sm font-semibold block leading-tight">{item.name}</span>
                      <span
                        className={`text-[11px] font-bold ${
                          inPantry ? 'text-[#34603B]' : 'text-[#B85737]'
                        }`}
                      >
                        {inPantry ? '✓ In your pantry' : '+ Needs to be added'}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-sm font-bold text-[#242320]">
                      {scaledQty} {item.unit}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>

          {meal.chefTip && (
            <div className="p-4 bg-[#F5F2EA] rounded-2xl border border-[#E5E2D9] text-xs text-[#242320] space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-[#4A6D4B]">
                <ChefHat className="w-4 h-4" />
                <span>Chef's Kitchen Tip</span>
              </div>
              <p className="leading-relaxed text-[#7A7870]">{meal.chefTip}</p>
            </div>
          )}
        </section>

        {/* RIGHT: STEP-BY-STEP INSTRUCTIONS */}
        <section className="lg:col-span-7 bg-white p-5 sm:p-7 rounded-3xl border border-[#E5E2D9] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3.5 border-b border-[#E5E2D9]">
            <div>
              <h2 className="text-lg font-bold text-[#242320]">Step-by-Step Cooking Guide</h2>
              <p className="text-xs text-[#7A7870] mt-0.5">
                Tap steps as you complete them to track your progress.
              </p>
            </div>
            <span className="text-xs font-bold text-[#4A6D4B] bg-[#EBF1EC] px-3 py-1 rounded-full border border-[#CDE0D0]">
              {completedSteps.length} of {meal.instructions.length} done
            </span>
          </div>

          <div className="space-y-3">
            {meal.instructions.map((step, idx) => {
              const isDone = completedSteps.includes(idx);

              return (
                <div
                  key={idx}
                  id={`instruction-step-${idx}`}
                  onClick={() => toggleStep(idx)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 select-none ${
                    isDone
                      ? 'bg-[#F5F2EA] border-[#E5E2D9] text-[#7A7870] opacity-70'
                      : 'bg-[#FDFCF9] border-[#E5E2D9] hover:border-[#4A6D4B] text-[#242320] shadow-2xs'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                      isDone
                        ? 'bg-[#34603B] text-white'
                        : 'bg-[#4A6D4B] text-white'
                    }`}
                  >
                    {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-bold text-[#7A7870] uppercase tracking-wider block">
                      Step {idx + 1}
                    </span>
                    <p
                      className={`text-sm leading-relaxed ${
                        isDone ? 'line-through text-[#7A7870]' : 'text-[#242320] font-medium'
                      }`}
                    >
                      {step}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {completedSteps.length === meal.instructions.length && (
            <div className="p-4 bg-[#EBF1EC] border border-[#CDE0D0] rounded-2xl text-center space-y-1 text-[#34603B]">
              <CheckCircle2 className="w-6 h-6 text-[#34603B] mx-auto" />
              <h3 className="text-sm font-bold">Meal Complete!</h3>
              <p className="text-xs">Your meal is ready to serve. Enjoy your delicious home-cooked food!</p>
            </div>
          )}
        </section>
      </div>

      {/* Bottom Sticky Return Action */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-[#E5E2D9] z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <button
            id="sticky-back-rec-btn"
            type="button"
            onClick={onBackToRecommendations}
            className="flex items-center gap-2 px-5 py-3 bg-[#F5F2EA] hover:bg-[#EAE6DC] text-[#242320] font-bold rounded-2xl text-xs sm:text-sm transition-colors border border-[#E5E2D9] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Choose Another Meal</span>
          </button>

          <button
            id="sticky-adjust-setup-btn"
            type="button"
            onClick={onBackToSetup}
            className="flex items-center gap-2 px-5 py-3 bg-[#4A6D4B] hover:bg-[#3B583C] text-white font-bold rounded-2xl text-xs sm:text-sm shadow-sm transition-all cursor-pointer"
          >
            <span>Update Ingredients & Criteria</span>
          </button>
        </div>
      </div>
    </div>
  );
}
