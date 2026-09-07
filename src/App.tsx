import { useState, useEffect } from 'react';
import { ActiveScreen, Meal, RecommendationFilterState, UserSetupState } from './types';
import { Navbar } from './components/Navbar';
import { MealSetup } from './components/MealSetup';
import { MealRecommendations } from './components/MealRecommendations';
import { MealDetail } from './components/MealDetail';
import { INVENTED_MEALS } from './data';

const DEFAULT_SETUP: UserSetupState = {
  selectedIngredientIds: ['ing_chicken', 'ing_eggs', 'ing_garlic', 'ing_rice', 'ing_broccoli', 'ing_olive_oil', 'ing_soy_sauce'],
  peopleCount: 2,
  timePreference: '30',
  mealPreference: 'Regular',
};

const DEFAULT_FILTERS: RecommendationFilterState = {
  sortBy: 'match',
  maxTimeFilter: 'all',
  preferenceFilter: 'all',
  onlyNoMissing: false,
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ActiveScreen>('setup');
  const [setupState, setSetupState] = useState<UserSetupState>(DEFAULT_SETUP);
  const [filterState, setFilterState] = useState<RecommendationFilterState>(DEFAULT_FILTERS);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(INVENTED_MEALS[0]);

  // Scroll to top whenever screen changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentScreen]);

  const updateSetup = (updated: Partial<UserSetupState>) => {
    setSetupState((prev) => ({ ...prev, ...updated }));
  };

  const updateFilters = (updated: Partial<RecommendationFilterState>) => {
    setFilterState((prev) => ({ ...prev, ...updated }));
  };

  const handleFindMeals = () => {
    // When clicking Find Meals, sync preference filter to the user's chosen setup preference if not Regular
    if (setupState.mealPreference !== 'Regular') {
      setFilterState((prev) => ({ ...prev, preferenceFilter: setupState.mealPreference }));
    } else {
      setFilterState((prev) => ({ ...prev, preferenceFilter: 'all' }));
    }
    setCurrentScreen('recommendations');
  };

  const handleSelectMeal = (meal: Meal) => {
    setSelectedMeal(meal);
    setCurrentScreen('detail');
  };

  const handleReset = () => {
    setSetupState(DEFAULT_SETUP);
    setFilterState(DEFAULT_FILTERS);
    setCurrentScreen('setup');
  };

  return (
    <div className="min-h-screen bg-[#FDFCF9] text-[#242320] flex flex-col font-sans selection:bg-[#4A6D4B]/20">
      {/* Navigation Bar */}
      <Navbar
        currentScreen={currentScreen}
        onNavigate={(screen) => setCurrentScreen(screen)}
        selectedMealName={selectedMeal?.name}
        onReset={handleReset}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        {currentScreen === 'setup' && (
          <MealSetup
            setupState={setupState}
            onUpdateSetup={updateSetup}
            onFindMeals={handleFindMeals}
          />
        )}

        {currentScreen === 'recommendations' && (
          <MealRecommendations
            setupState={setupState}
            filterState={filterState}
            onUpdateFilters={updateFilters}
            onSelectMeal={handleSelectMeal}
            onBackToSetup={() => setCurrentScreen('setup')}
          />
        )}

        {currentScreen === 'detail' && selectedMeal && (
          <MealDetail
            meal={selectedMeal}
            setupState={setupState}
            onBackToRecommendations={() => setCurrentScreen('recommendations')}
            onBackToSetup={() => setCurrentScreen('setup')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#F5F2EA] border-t border-[#E5E2D9] text-[#7A7870] py-8 px-4 text-center text-xs space-y-1.5 mt-12">
        <p className="font-semibold text-[#242320]">
          PantryPilot • Balanced Everyday Cooking Assistant
        </p>
        <p className="text-[#7A7870]">
          MGMT 6110 Human-AI Collaboration Prototype • Singapore Management University
        </p>
      </footer>
    </div>
  );
}
