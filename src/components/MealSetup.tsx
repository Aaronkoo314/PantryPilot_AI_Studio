import { useState, useMemo } from 'react';
import {
  Users,
  Clock,
  Sparkles,
  Search,
  Check,
  Flame,
  Zap,
  Heart,
  ChefHat,
  ArrowRight,
  CheckCircle2,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import { INVENTED_INGREDIENTS, INVENTED_MEALS } from '../data';
import {
  IngredientCategory,
  MealPreference,
  MealTimeOption,
  UserSetupState,
} from '../types';
import { filterAndSortMeals } from '../utils/mealMatcher';

interface MealSetupProps {
  setupState: UserSetupState;
  onUpdateSetup: (updated: Partial<UserSetupState>) => void;
  onFindMeals: () => void;
}

const CATEGORIES: ('All' | IngredientCategory)[] = [
  'All',
  'Proteins',
  'Vegetables',
  'Grains & Carbs',
  'Dairy & Eggs',
  'Pantry & Seasonings',
];

const TIME_OPTIONS: { id: MealTimeOption; label: string; desc: string }[] = [
  { id: '15', label: '15 minutes', desc: 'Fast skillet & assemble' },
  { id: '30', label: '30 minutes', desc: 'Balanced everyday cooking' },
  { id: '60', label: '60+ minutes', desc: 'Slow simmers & baking' },
];

const PREFERENCE_OPTIONS: {
  id: MealPreference;
  label: string;
  desc: string;
  icon: typeof Sparkles;
  badge: string;
}[] = [
  {
    id: 'Regular',
    label: 'Regular',
    desc: 'All comforting home-style recipes without specific restrictions',
    icon: ChefHat,
    badge: 'Standard',
  },
  {
    id: 'Quick & Easy',
    label: 'Quick & Easy',
    desc: 'Minimal prep, fast cleanup, and under 20-minute cook time',
    icon: Zap,
    badge: 'Speedy',
  },
  {
    id: 'Fitness',
    label: 'Fitness',
    desc: 'High protein, nutrient-dense, and lower calorie balance',
    icon: Flame,
    badge: 'High Protein',
  },
  {
    id: 'Family Meal',
    label: 'Family Meal',
    desc: 'Generous servings, crowd-pleasing flavors suitable for kids & groups',
    icon: Heart,
    badge: 'Generous',
  },
];

export function MealSetup({ setupState, onUpdateSetup, onFindMeals }: MealSetupProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'All' | IngredientCategory>('All');

  // Toggle ingredient selection
  const toggleIngredient = (id: string) => {
    const isSelected = setupState.selectedIngredientIds.includes(id);
    const updated = isSelected
      ? setupState.selectedIngredientIds.filter((item) => item !== id)
      : [...setupState.selectedIngredientIds, id];
    onUpdateSetup({ selectedIngredientIds: updated });
  };

  // Quick preset actions
  const selectCommonEssentials = () => {
    const commonIds = INVENTED_INGREDIENTS.filter((i) => i.suggestedPantry).map((i) => i.id);
    // Merge without duplicates
    const merged = Array.from(new Set([...setupState.selectedIngredientIds, ...commonIds]));
    onUpdateSetup({ selectedIngredientIds: merged });
  };

  const selectAllIngredients = () => {
    onUpdateSetup({ selectedIngredientIds: INVENTED_INGREDIENTS.map((i) => i.id) });
  };

  const clearAllIngredients = () => {
    onUpdateSetup({ selectedIngredientIds: [] });
  };

  // Filter ingredients by category and search
  const filteredIngredients = useMemo(() => {
    return INVENTED_INGREDIENTS.filter((item) => {
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase().trim());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  // Compute live preview of matching meals count
  const matchingMealsCount = useMemo(() => {
    const results = filterAndSortMeals(
      INVENTED_MEALS,
      setupState.selectedIngredientIds,
      setupState.timePreference,
      setupState.mealPreference,
      {
        sortBy: 'match',
        maxTimeFilter: 'all',
        preferenceFilter: 'all',
        onlyNoMissing: false,
      }
    );
    return results.length;
  }, [setupState]);

  return (
    <div className="space-y-6 sm:space-y-8 pb-28">
      {/* Hero Welcome banner */}
      <div className="bg-[#F5F2EA] p-6 sm:p-8 rounded-3xl border border-[#E5E2D9] shadow-xs">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4A6D4B]/10 text-[#4A6D4B] text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#4A6D4B]" />
            Step 1: Kitchen Inventory & Constraints
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#242320] tracking-tight">
            What are we cooking with today?
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#7A7870] leading-relaxed">
            Select what you have in your pantry or fridge, choose your portions and available time, and
            PantryPilot will recommend the best practical meals for you.
          </p>
        </div>
      </div>

      {/* SECTION 1: INGREDIENTS SELECTION */}
      <section className="bg-white p-5 sm:p-7 rounded-3xl border border-[#E5E2D9] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E5E2D9]">
          <div>
            <h2 className="text-lg font-bold text-[#242320] flex items-center gap-2.5">
              <span>1. Available Ingredients</span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#4A6D4B]/10 text-[#4A6D4B]">
                {setupState.selectedIngredientIds.length} Selected
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-[#7A7870] mt-0.5">
              Tap the items currently in your fridge, freezer, or pantry cupboard.
            </p>
          </div>

          {/* Quick presets */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              id="setup-preset-common-btn"
              type="button"
              onClick={selectCommonEssentials}
              className="text-xs px-3 py-1.5 rounded-xl bg-[#F5F2EA] hover:bg-[#EAE6DC] text-[#242320] border border-[#E5E2D9] font-semibold transition-colors cursor-pointer"
            >
              + Add Common Basics
            </button>
            <button
              id="setup-select-all-btn"
              type="button"
              onClick={selectAllIngredients}
              className="text-xs px-3 py-1.5 rounded-xl bg-[#F5F2EA] hover:bg-[#EAE6DC] text-[#242320] border border-[#E5E2D9] font-semibold transition-colors cursor-pointer"
            >
              Select All
            </button>
            {setupState.selectedIngredientIds.length > 0 && (
              <button
                id="setup-clear-btn"
                type="button"
                onClick={clearAllIngredients}
                className="text-xs px-2.5 py-1.5 rounded-xl text-[#D97757] hover:bg-[#FBF1ED] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Search & Category Tabs */}
        <div className="space-y-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#7A7870] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="ingredient-search-input"
              type="text"
              placeholder="Search ingredients (e.g., chicken, garlic, rice, eggs)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#FDFCF9] border border-[#E5E2D9] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#4A6D4B]/30 focus:border-[#4A6D4B] transition-all text-[#242320]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#7A7870] hover:text-[#242320] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category filter pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                id={`cat-filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#4A6D4B] text-white shadow-xs'
                    : 'bg-[#F5F2EA] text-[#7A7870] hover:text-[#242320] hover:bg-[#EAE6DC]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Ingredient Chips Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 pt-1">
          {filteredIngredients.map((item) => {
            const isSelected = setupState.selectedIngredientIds.includes(item.id);
            return (
              <button
                key={item.id}
                id={`ingredient-chip-${item.id}`}
                type="button"
                onClick={() => toggleIngredient(item.id)}
                className={`flex items-center justify-between p-3 rounded-2xl border text-left transition-all min-h-[48px] select-none cursor-pointer ${
                  isSelected
                    ? 'bg-[#EBF1EC] border-[#4A6D4B] text-[#242320] font-semibold ring-1 ring-[#4A6D4B]/30 shadow-xs'
                    : 'bg-[#FDFCF9] border-[#E5E2D9] text-[#242320] hover:bg-[#F5F2EA] hover:border-[#D1CDC1]'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="text-xl shrink-0" role="img" aria-label={item.name}>
                    {item.emoji}
                  </span>
                  <span className="text-sm truncate">{item.name}</span>
                </div>
                <div
                  className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 ml-1.5 transition-colors ${
                    isSelected ? 'bg-[#4A6D4B] text-white' : 'border border-[#E5E2D9] bg-white'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>

        {filteredIngredients.length === 0 && (
          <div className="text-center py-8 text-[#7A7870] text-sm">
            No ingredients found matching "{searchQuery}". Try a different term or clear the search.
          </div>
        )}
      </section>

      {/* SECTION 2: PEOPLE EATING & AVAILABLE TIME */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Number of People */}
        <section className="bg-white p-5 sm:p-7 rounded-3xl border border-[#E5E2D9] shadow-xs space-y-3">
          <div>
            <h2 className="text-lg font-bold text-[#242320] flex items-center gap-2">
              <Users className="w-5 h-5 text-[#4A6D4B]" />
              <span>2. Number of People Eating</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#7A7870] mt-0.5">
              Portions and ingredient amounts will automatically adjust.
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            {/* Stepper */}
            <div className="flex items-center border border-[#E5E2D9] rounded-2xl bg-[#F5F2EA] p-1">
              <button
                id="people-decrement-btn"
                type="button"
                onClick={() => onUpdateSetup({ peopleCount: Math.max(1, setupState.peopleCount - 1) })}
                className="w-11 h-11 rounded-xl bg-white border border-[#E5E2D9] shadow-xs flex items-center justify-center text-[#242320] font-bold hover:bg-[#FDFCF9] active:scale-95 transition-all cursor-pointer"
                aria-label="Decrease people count"
              >
                -
              </button>
              <div className="w-16 text-center">
                <span className="text-2xl font-extrabold text-[#242320] leading-none">
                  {setupState.peopleCount}
                </span>
                <span className="block text-[10px] uppercase font-bold text-[#7A7870] tracking-wider">
                  {setupState.peopleCount === 1 ? 'person' : 'people'}
                </span>
              </div>
              <button
                id="people-increment-btn"
                type="button"
                onClick={() => onUpdateSetup({ peopleCount: Math.min(10, setupState.peopleCount + 1) })}
                className="w-11 h-11 rounded-xl bg-white border border-[#E5E2D9] shadow-xs flex items-center justify-center text-[#242320] font-bold hover:bg-[#FDFCF9] active:scale-95 transition-all cursor-pointer"
                aria-label="Increase people count"
              >
                +
              </button>
            </div>

            {/* Quick selectors */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {[1, 2, 4, 6].map((count) => (
                <button
                  key={count}
                  id={`people-preset-${count}`}
                  type="button"
                  onClick={() => onUpdateSetup({ peopleCount: count })}
                  className={`px-3 py-2 text-xs rounded-xl font-semibold border transition-all cursor-pointer ${
                    setupState.peopleCount === count
                      ? 'bg-[#4A6D4B] text-white border-[#4A6D4B] shadow-xs'
                      : 'bg-[#F5F2EA] text-[#242320] border-[#E5E2D9] hover:bg-[#EAE6DC]'
                  }`}
                >
                  {count} {count === 1 ? 'Person' : 'People'}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Available Cooking Time */}
        <section className="bg-white p-5 sm:p-7 rounded-3xl border border-[#E5E2D9] shadow-xs space-y-3">
          <div>
            <h2 className="text-lg font-bold text-[#242320] flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#4A6D4B]" />
              <span>3. Available Cooking Time</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#7A7870] mt-0.5">
              How much hands-on cooking time do you have?
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2.5 pt-2">
            {TIME_OPTIONS.map((time) => {
              const isSelected = setupState.timePreference === time.id;
              return (
                <button
                  key={time.id}
                  id={`time-pref-${time.id}`}
                  type="button"
                  onClick={() => onUpdateSetup({ timePreference: time.id })}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all min-h-[72px] cursor-pointer ${
                    isSelected
                      ? 'bg-[#EBF1EC] border-[#4A6D4B] ring-2 ring-[#4A6D4B]/20 shadow-xs'
                      : 'bg-[#FDFCF9] border-[#E5E2D9] hover:bg-[#F5F2EA]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-sm font-bold ${
                        isSelected ? 'text-[#4A6D4B]' : 'text-[#242320]'
                      }`}
                    >
                      {time.label}
                    </span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-[#4A6D4B] shrink-0" />}
                  </div>
                  <span className="text-[11px] text-[#7A7870] leading-tight mt-1">
                    {time.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      {/* SECTION 3: MEAL PREFERENCE */}
      <section className="bg-white p-5 sm:p-7 rounded-3xl border border-[#E5E2D9] shadow-xs space-y-3">
        <div>
          <h2 className="text-lg font-bold text-[#242320] flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-[#4A6D4B]" />
            <span>4. Meal Preference</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#7A7870] mt-0.5">
            Choose what kind of dining experience or nutritional goal you're prioritizing.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {PREFERENCE_OPTIONS.map((pref) => {
            const isSelected = setupState.mealPreference === pref.id;
            const Icon = pref.icon;
            return (
              <button
                key={pref.id}
                id={`pref-${pref.id.toLowerCase().replace(/[\s&]+/g, '-')}`}
                type="button"
                onClick={() => onUpdateSetup({ mealPreference: pref.id })}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all min-h-[110px] cursor-pointer ${
                  isSelected
                    ? 'bg-[#EBF1EC] border-[#4A6D4B] ring-2 ring-[#4A6D4B]/20 shadow-xs'
                    : 'bg-[#FDFCF9] border-[#E5E2D9] hover:bg-[#F5F2EA]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        isSelected ? 'bg-[#4A6D4B] text-white' : 'bg-[#F5F2EA] text-[#7A7870]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        isSelected
                          ? 'bg-[#4A6D4B]/15 text-[#4A6D4B]'
                          : 'bg-[#F5F2EA] text-[#7A7870]'
                      }`}
                    >
                      {pref.badge}
                    </span>
                  </div>
                  <h3
                    className={`text-sm font-bold ${
                      isSelected ? 'text-[#4A6D4B]' : 'text-[#242320]'
                    }`}
                  >
                    {pref.label}
                  </h3>
                  <p className="text-xs text-[#7A7870] mt-1 leading-snug">{pref.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* STICKY BOTTOM ACTION BAR */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-[#E5E2D9] z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="text-[#242320] text-xs sm:text-sm">
            <span className="font-extrabold text-[#242320] block sm:inline">
              {setupState.selectedIngredientIds.length} ingredients selected
            </span>
            <span className="text-[#7A7870] sm:ml-2 text-xs">
              • {setupState.peopleCount} {setupState.peopleCount === 1 ? 'person' : 'people'} •{' '}
              {setupState.timePreference}m time • {setupState.mealPreference}
            </span>
          </div>

          <button
            id="find-meals-btn"
            type="button"
            onClick={onFindMeals}
            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[#4A6D4B] hover:bg-[#3B583C] text-white font-bold rounded-2xl shadow-sm hover:shadow-md active:scale-95 transition-all text-sm sm:text-base shrink-0 cursor-pointer"
          >
            <span>Find Meals</span>
            <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full font-bold">
              {matchingMealsCount}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
