import { UtensilsCrossed, ChevronRight, RotateCcw } from 'lucide-react';
import { ActiveScreen } from '../types';

interface NavbarProps {
  currentScreen: ActiveScreen;
  onNavigate: (screen: ActiveScreen) => void;
  selectedMealName?: string;
  onReset: () => void;
}

export function Navbar({ currentScreen, onNavigate, selectedMealName, onReset }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md text-[#242320] border-b border-[#E5E2D9] shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Brand */}
        <button
          id="nav-logo-btn"
          onClick={() => onNavigate('setup')}
          className="flex items-center gap-2.5 text-left group focus:outline-none cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-[#4A6D4B] flex items-center justify-center text-white shadow-xs group-hover:bg-[#3B583C] transition-all">
            <UtensilsCrossed className="w-4 h-4" />
          </div>
          <div>
            <div className="font-extrabold text-lg leading-none tracking-tight text-[#4A6D4B] flex items-center gap-2">
              <span>PantryPilot</span>
              <span className="text-[10px] uppercase font-bold tracking-wider bg-[#4A6D4B]/10 text-[#4A6D4B] px-2 py-0.5 rounded-full">
                Assistant
              </span>
            </div>
            <p className="text-[11px] text-[#7A7870] font-medium hidden sm:block mt-0.5">
              Balanced Everyday Cooking
            </p>
          </div>
        </button>

        {/* Step Indicator Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm">
          <button
            id="nav-step-setup"
            onClick={() => onNavigate('setup')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
              currentScreen === 'setup'
                ? 'bg-[#4A6D4B] text-white shadow-xs'
                : 'text-[#7A7870] hover:text-[#242320] hover:bg-[#F5F2EA]'
            }`}
          >
            1. Setup
          </button>

          <ChevronRight className="w-3.5 h-3.5 text-[#A6A49C] shrink-0" />

          <button
            id="nav-step-recommendations"
            onClick={() => onNavigate('recommendations')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
              currentScreen === 'recommendations'
                ? 'bg-[#4A6D4B] text-white shadow-xs'
                : 'text-[#7A7870] hover:text-[#242320] hover:bg-[#F5F2EA]'
            }`}
          >
            2. Meals
          </button>

          {currentScreen === 'detail' && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-[#A6A49C] shrink-0" />
              <span className="px-3 py-1.5 rounded-xl bg-[#4A6D4B] text-white font-bold truncate max-w-[110px] sm:max-w-[150px] shadow-xs">
                3. {selectedMealName || 'Recipe'}
              </span>
            </>
          )}
        </nav>

        {/* Quick Reset */}
        <button
          id="nav-reset-btn"
          onClick={onReset}
          title="Reset Pantry & Preferences"
          className="px-2.5 py-1.5 text-[#7A7870] hover:text-[#242320] hover:bg-[#F5F2EA] border border-[#E5E2D9] rounded-xl transition-all flex items-center gap-1.5 text-xs font-medium cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Reset</span>
        </button>
      </div>
    </header>
  );
}

