import { useMemo } from 'react';
import { useMealStore } from '../../store/useMealStore';
import { CalorieRing } from './CalorieRing';
import { MacroBar } from './MacroBar';
import { MacroPieChart } from './MacroPieChart';

export function DashboardHeader() {
    const { meals, goals, selectedDateStr } = useMealStore();

    const { totalCalories, totalProtein, totalCarbs, totalFat } = useMemo(() => {
        const todaysMeals = meals.filter((meal) => meal.dateStr === selectedDateStr);
        return {
            totalCalories: todaysMeals.reduce((sum, meal) => sum + meal.calories, 0),
            totalProtein: todaysMeals.reduce((sum, meal) => sum + meal.protein, 0),
            totalCarbs: todaysMeals.reduce((sum, meal) => sum + meal.carbs, 0),
            totalFat: todaysMeals.reduce((sum, meal) => sum + meal.fat, 0),
        };
    }, [meals, selectedDateStr]);

    return (
        <div className="flex flex-col gap-6 w-full mb-8">
            {/* Top Section: Circular Progress */}
            <CalorieRing consumed={totalCalories} goal={goals.calories} />

            {/* Macro Bars */}
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

            {/* Macro Pie Chart */}
            <MacroPieChart protein={totalProtein} carbs={totalCarbs} fat={totalFat} />
        </div>
    );
}
