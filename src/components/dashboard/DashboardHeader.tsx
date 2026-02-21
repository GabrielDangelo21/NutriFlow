import { useMealStore } from '../../store/useMealStore';
import { CalorieRing } from './CalorieRing';
import { MacroBar } from './MacroBar';

export function DashboardHeader() {
    const { meals, goals, selectedDateStr } = useMealStore();

    // Calculate totals for the selected day
    const todaysMeals = meals.filter((meal) => meal.dateStr === selectedDateStr);
    const totalCalories = todaysMeals.reduce((sum, meal) => sum + meal.calories, 0);
    const totalProtein = todaysMeals.reduce((sum, meal) => sum + meal.protein, 0);
    const totalCarbs = todaysMeals.reduce((sum, meal) => sum + meal.carbs, 0);
    const totalFat = todaysMeals.reduce((sum, meal) => sum + meal.fat, 0);

    return (
        <div className="flex flex-col gap-6 w-full mb-8">
            {/* Top Section: Circular Progress */}
            <CalorieRing consumed={totalCalories} goal={goals.calories} />

            {/* Bottom Section: Macro Bars */}
            <div className="flex flex-col gap-4 p-5 bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800">
                <MacroBar
                    label="Carboidratos"
                    consumed={totalCarbs}
                    goal={goals.carbs}
                    baseColorClass="bg-blue-500 dark:bg-blue-400"
                />
                <MacroBar
                    label="Proteínas"
                    consumed={totalProtein}
                    goal={goals.protein}
                    baseColorClass="bg-emerald-500 dark:bg-emerald-400"
                />
                <MacroBar
                    label="Gorduras"
                    consumed={totalFat}
                    goal={goals.fat}
                    baseColorClass="bg-purple-500 dark:bg-purple-400"
                />
            </div>
        </div>
    );
}
