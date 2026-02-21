import { useState, useEffect } from 'react';
import { Plus, Settings, Sparkles, PenLine, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppLayout } from './layout/AppLayout';
import { DashboardHeader } from './components/dashboard/DashboardHeader';
import { MealsList } from './components/meals/MealsList';
import { AddMealModal } from './components/meals/AddMealModal';
import { HistoryChart } from './components/dashboard/HistoryChart';
import { SettingsModal } from './components/SettingsModal';
import { AiAnalyzerModal } from './components/ai/AiAnalyzerModal';
import { AuthPage } from './components/auth/AuthPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useMealStore } from './store/useMealStore';
import { ProfileEditor } from './components/profile/ProfileEditor';
import { ToastContainer } from './components/ui/Toast';
import type { MealCategory } from './types';

export type AppView = 'dashboard' | 'profile';

const getTodayStr = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

function formatDateLabel(dateStr: string): string {
  const today = getTodayStr();
  if (dateStr === today) return 'Hoje';

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
  if (dateStr === yesterdayStr) return 'Ontem';

  const [, month, day] = dateStr.split('-');
  return `${day}/${month}`;
}

function shiftDate(dateStr: string, days: number): string {
  const date = new Date(dateStr + 'T12:00:00');
  date.setDate(date.getDate() + days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function Dashboard() {
  const { fetchMeals, fetchGoals, selectedDateStr, setSelectedDate } = useMealStore();

  useEffect(() => {
    fetchMeals();
    fetchGoals();
  }, [fetchMeals, fetchGoals]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [defaultCategory, setDefaultCategory] = useState<MealCategory>('lunch');
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<any>(null);

  const isToday = selectedDateStr === getTodayStr();

  const handleOpenManual = (category: MealCategory = 'lunch') => {
    setEditingMeal(null);
    setDefaultCategory(category);
    setIsModalOpen(true);
    setIsFabOpen(false);
  };

  const handleEditMeal = (meal: any) => {
    setEditingMeal(meal);
    setDefaultCategory(meal.category);
    setIsModalOpen(true);
  };

  const handleOpenAi = (category: MealCategory = 'lunch') => {
    setDefaultCategory(category);
    setIsAiOpen(true);
    setIsFabOpen(false);
  };

  return (
    <>
      <div className="flex flex-col gap-6 pb-24 relative">
        {/* Date Navigation Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSelectedDate(shiftDate(selectedDateStr, -1))}
              className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 outline-none"
              aria-label="Dia anterior"
            >
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-zinc-800 to-zinc-500 dark:from-zinc-100 dark:to-zinc-400 bg-clip-text text-transparent min-w-[72px] text-center">
              {formatDateLabel(selectedDateStr)}
            </h2>
            <button
              onClick={() => setSelectedDate(shiftDate(selectedDateStr, 1))}
              disabled={isToday}
              className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 outline-none disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Próximo dia"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 focus-visible:ring-2 focus-visible:ring-emerald-500 outline-none"
            aria-label="Configurações"
          >
            <Settings size={20} />
          </button>
        </div>

        <DashboardHeader />

        <MealsList onAddMeal={handleOpenManual} onEditMeal={handleEditMeal} />

        <HistoryChart />
      </div>

      {/* Speed Dial FAB */}
      <div className="fixed bottom-6 right-6 sm:bottom-10 sm:right-10 flex flex-col items-end gap-3 z-40">
        <AnimatePresence>
          {isFabOpen && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.8 }}
              className="flex flex-col items-end gap-3"
            >
              <button
                onClick={() => handleOpenManual('lunch')}
                className="flex items-center gap-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-lg px-4 py-2.5 rounded-full hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors outline-none"
              >
                <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Manual</span>
                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <PenLine size={16} />
                </div>
              </button>

              <button
                onClick={() => handleOpenAi('lunch')}
                className="flex items-center gap-3 bg-indigo-500 hover:bg-indigo-600 shadow-lg shadow-indigo-500/30 px-4 py-2.5 rounded-full transition-colors outline-none"
              >
                <span className="text-sm font-semibold text-white">NutriAI</span>
                <div className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center">
                  <Sparkles size={16} />
                </div>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setIsFabOpen(!isFabOpen)}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform focus-visible:ring-4 outline-none z-40 ${isFabOpen
            ? 'bg-zinc-800 dark:bg-zinc-700 text-white focus-visible:ring-zinc-500 rotate-45'
            : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/30 focus-visible:ring-emerald-500/30'
            }`}
          aria-label={isFabOpen ? "Fechar menu" : "Opções de refeição"}
        >
          <Plus size={28} />
        </button>
      </div>

      <AddMealModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingMeal(null);
        }}
        defaultCategory={defaultCategory}
        mealToEdit={editingMeal}
      />

      <AiAnalyzerModal
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        defaultCategory={defaultCategory}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
}

function AppContent() {
  const { user, loading } = useAuth();
  const [view, setView] = useState<AppView>('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-emerald-200 dark:border-emerald-800 border-t-emerald-500 animate-spin" />
          <p className="text-sm text-zinc-400">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <AppLayout onProfileClick={() => setView('profile')}>
      {view === 'dashboard' ? (
        <Dashboard />
      ) : (
        <ProfileEditor onBack={() => setView('dashboard')} />
      )}
    </AppLayout>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
      <ToastContainer />
    </AuthProvider>
  );
}

export default App;
